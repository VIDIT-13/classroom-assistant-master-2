const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Import route files
const authRoutes = require('./routes/authRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
    if (/^what\s+is\s+autograd[\s\?\.]*$/i.test(prompt.trim())) {
      return res.json({
        response: "Autograd is an AI-driven automatic grading system.",
      });
      if (/how\s+(will|does)\s+it\s+improve\s+my\s+education[\s\?\.]*$/i.test(prompt.trim())) {
        return res.json({
          response: "It will check your assignments, provide you with a dedicated learning path, offer helpful resources, and guide you through a structured learning workflow.",
        });
      }
      if (/how\s+can\s+I\s+use\s+it[\s\?\.]*$/i.test(prompt.trim())) {
        return res.json({
          response: "You can use it by submitting your assignments through the platform, and it will automatically grade them for you.",
        });
      }
      if (/what\s+is\s+the\s+benefit\s+of\s+using\s+autograd[\s\?\.]*$/i.test(prompt.trim())) {
        return res.json({
          response: "The benefit of using Autograd is that it saves time and provides instant feedback on your assignments.",
        });
      }      
    }
    
    
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    res.json({ response: text });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get response from Gemini API', details: err.message });
  }
});

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submit', submissionRoutes);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});
