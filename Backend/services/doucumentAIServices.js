const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const fs = require('fs');
const path = require('path');

// Ensure credentials path is set
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.warn('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set. Ensure you have a valid service account key file.');
}

async function processDocument(filePath) {
  // Validate required environment variables
  const requiredEnvVars = [
    'GCP_PROJECT_ID', 
    'GCP_LOCATION', 
    'DOCUMENT_AI_PROCESSOR_ID',
    'GOOGLE_APPLICATION_CREDENTIALS'
  ];

  // Check for missing environment variables
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  try {
    // Validate service account key file exists
    if (!fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
      throw new Error(`Service account key file not found: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
    }

    // Validate input file
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileExtension = path.extname(filePath).toLowerCase();
    let mimeType;
    
    // Expanded mime type support
    switch (fileExtension) {
      case '.pdf':
        mimeType = 'application/pdf';
        break;
      case '.docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case '.doc':
        mimeType = 'application/msword';
        break;
      case '.txt':
        mimeType = 'text/plain';
        break;
      default:
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }

    // Create Document AI client with explicit credentials
    const client = new DocumentProcessorServiceClient({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });

    const name = `projects/${process.env.GCP_PROJECT_ID}/locations/${process.env.GCP_LOCATION}/processors/${process.env.DOCUMENT_AI_PROCESSOR_ID}`;

    // Read file and encode
    const imageFile = fs.readFileSync(filePath);
    const encodedImage = Buffer.from(imageFile).toString('base64');

    const request = {
      name,
      rawDocument: {
        content: encodedImage,
        mimeType,
      },
    };

    // Process document
    const [result] = await client.processDocument(request);
    const { document } = result;

    // Extract text with more robust handling
    let extractedText = '';
    
    if (document.text) {
      extractedText = document.text;
    } else if (document.pages && document.pages.length > 0) {
      extractedText = document.pages
        .map(page => page.paragraphs?.map(p => p.text).join('\n') || '')
        .join('\n');
    } else if (document.entities) {
      extractedText = document.entities
        .map(entity => entity.mentionText)
        .join('\n');
    }

    return extractedText.trim();
  } catch (error) {
    console.error('Detailed Document Processing Error:', error);
    
    // More informative error handling
    if (error.code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}`);
    }
    
    if (error.message.includes('API_KEY_INVALID')) {
      throw new Error('Invalid Google Cloud credentials. Please check your service account key.');
    }

    throw error;
  }
}

module.exports = { processDocument };