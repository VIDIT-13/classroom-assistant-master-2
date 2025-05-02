import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import SummaryDisplay from '../components/SummaryDisplay';

const HomePage = () => {
  const [documentData, setDocumentData] = useState(null);

  const handleUploadSuccess = (data) => {
    setDocumentData(data);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">PDF Summarizer</h1>
      <p className="mb-4">
        Upload a handwritten PDF document to extract text and generate a summary.
      </p>
      
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          
          {documentData && (
            <SummaryDisplay
              documentId={documentData.documentId}
              extractedText={documentData.extractedText}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;