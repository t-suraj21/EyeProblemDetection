import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// AI Model API Configuration
const AI_MODEL_URL = process.env.AI_MODEL_URL || 'http://localhost:8000';
const AI_MODEL_TIMEOUT = 30000; // 30 seconds
const USE_PYTHON_AI = process.env.USE_PYTHON_AI === 'true';

// Mock AI response for development/testing
const mockAIResponse = {
  problem: "Diabetic Retinopathy",
  confidenceScore: 87.5,
  cause: "Long-term diabetes affecting blood vessels in the retina",
  severity: "Moderate",
  suggestions: [
    "Schedule regular eye checkups",
    "Control blood sugar levels",
    "Monitor blood pressure",
    "Consider laser treatment if recommended"
  ]
};

/**
 * Analyze retina image using AI model
 * @param {string} imagePath - Path to the uploaded image
 * @returns {Object} AI analysis result
 */
export const analyzeRetinaImage = async (imagePath) => {
  try {
    // Check if image file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error('Image file not found');
    }

    // For development, return mock response
    if (process.env.NODE_ENV === 'development' && !process.env.USE_REAL_AI) {
      console.log('Using mock AI response for development');
      return mockAIResponse;
    }

    // Use Python AI service if enabled
    if (USE_PYTHON_AI) {
      return await analyzeWithPythonAI(imagePath);
    }

    // Prepare image data for AI model
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Make request to AI model
    const response = await axios.post(`${AI_MODEL_URL}/predict`, {
      image_data: base64Image,
      image_path: imagePath
    }, {
      timeout: AI_MODEL_TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Validate AI response
    const aiResult = response.data;
    if (!aiResult || !aiResult.problem) {
      throw new Error('Invalid response from AI model');
    }

    return {
      problem: aiResult.problem,
      confidenceScore: aiResult.confidenceScore || 0,
      cause: aiResult.cause || 'Unknown',
      severity: aiResult.severity || 'Low',
      suggestions: aiResult.suggestions || []
    };

  } catch (error) {
    console.error('AI Service Error:', error.message);
    
    // Fallback to mock response if AI service is unavailable
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.log('AI service unavailable, using fallback response');
      return mockAIResponse;
    }
    
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

/**
 * Analyze image using Python AI service
 * @param {string} imagePath - Path to the uploaded image
 * @returns {Object} AI analysis result
 */
const analyzeWithPythonAI = async (imagePath) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '..', 'ai_model', 'ai_service.py');
    
    // Create a simple Python script to run the analysis
    const analysisScript = `
import sys
import json
sys.path.append('${path.join(__dirname, '..', 'ai_model')}')
from ai_service import analyze_retina_image

try:
    result = analyze_retina_image('${imagePath}')
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({'error': str(e)}))
`;

    const pythonProcess = spawn('python3', ['-c', analysisScript], {
      cwd: path.join(__dirname, '..')
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python AI Error:', errorOutput);
        reject(new Error(`Python AI process failed with code ${code}`));
        return;
      }

      try {
        const result = JSON.parse(output);
        if (result.error) {
          reject(new Error(result.error));
          return;
        }
        resolve(result);
      } catch (parseError) {
        reject(new Error(`Failed to parse Python AI output: ${parseError.message}`));
      }
    });

    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python AI process: ${error.message}`));
    });
  });
};

/**
 * Get medicine suggestions for specific eye problems
 * @param {string} problem - Detected eye problem
 * @returns {Array} List of medicine suggestions
 */
export const getMedicineSuggestions = (problem) => {
  const medicineDatabase = {
    'Diabetic Retinopathy': [
      'Anti-VEGF injections (Lucentis, Avastin)',
      'Corticosteroid implants',
      'Laser photocoagulation treatment'
    ],
    'Glaucoma': [
      'Prostaglandin analogs (Latanoprost)',
      'Beta blockers (Timolol)',
      'Alpha agonists (Brimonidine)',
      'Carbonic anhydrase inhibitors'
    ],
    'Cataract': [
      'Surgery is the primary treatment',
      'Pre-surgery: Lubricating eye drops',
      'Post-surgery: Anti-inflammatory drops'
    ],
    'Macular Degeneration': [
      'Anti-VEGF therapy (Eylea, Lucentis)',
      'Photodynamic therapy',
      'Vitamin supplements (AREDS2 formula)'
    ],
    'Hypertensive Retinopathy': [
      'Blood pressure medications',
      'Regular monitoring',
      'Lifestyle modifications'
    ]
  };

  return medicineDatabase[problem] || [
    'Consult with an ophthalmologist',
    'Regular eye checkups',
    'Maintain healthy lifestyle'
  ];
};

/**
 * Get care tips for specific eye problems
 * @param {string} problem - Detected eye problem
 * @returns {Array} List of care tips
 */
export const getCareTips = (problem) => {
  const tipsDatabase = {
    'Diabetic Retinopathy': [
      'Control blood sugar levels',
      'Monitor blood pressure',
      'Regular eye examinations',
      'Quit smoking',
      'Maintain healthy diet'
    ],
    'Glaucoma': [
      'Regular eye pressure checks',
      'Take medications as prescribed',
      'Protect eyes from injury',
      'Avoid activities that increase eye pressure',
      'Regular follow-ups with ophthalmologist'
    ],
    'Cataract': [
      'Wear sunglasses with UV protection',
      'Quit smoking',
      'Eat a diet rich in antioxidants',
      'Regular eye checkups',
      'Consider surgery when vision affects daily activities'
    ],
    'Macular Degeneration': [
      'Eat leafy green vegetables',
      'Take AREDS2 supplements if recommended',
      'Quit smoking',
      'Protect eyes from UV light',
      'Regular monitoring with Amsler grid'
    ]
  };

  return tipsDatabase[problem] || [
    'Regular eye checkups',
    'Protect eyes from UV radiation',
    'Maintain healthy lifestyle',
    'Avoid smoking',
    'Eat a balanced diet rich in vitamins'
  ];
}; 