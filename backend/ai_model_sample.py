"""
Sample Python AI Model for Eye Problem Detection
This is a reference implementation that the Node.js backend can connect to.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import cv2
import numpy as np
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Mock AI model responses for different eye conditions
MOCK_RESPONSES = {
    'diabetic_retinopathy': {
        "problem": "Diabetic Retinopathy",
        "confidenceScore": 87.5,
        "cause": "Long-term diabetes affecting blood vessels in the retina",
        "severity": "Moderate",
        "suggestions": [
            "Schedule regular eye checkups",
            "Control blood sugar levels",
            "Monitor blood pressure",
            "Consider laser treatment if recommended"
        ]
    },
    'glaucoma': {
        "problem": "Glaucoma",
        "confidenceScore": 92.3,
        "cause": "Increased pressure in the eye damaging optic nerve",
        "severity": "High",
        "suggestions": [
            "Immediate consultation with ophthalmologist",
            "Prescription eye drops",
            "Regular eye pressure monitoring",
            "Avoid activities that increase eye pressure"
        ]
    },
    'cataract': {
        "problem": "Cataract",
        "confidenceScore": 78.9,
        "cause": "Clouding of the eye's natural lens",
        "severity": "Low",
        "suggestions": [
            "Regular eye examinations",
            "Wear sunglasses with UV protection",
            "Consider surgery when vision affects daily activities",
            "Maintain healthy diet rich in antioxidants"
        ]
    },
    'macular_degeneration': {
        "problem": "Age-related Macular Degeneration",
        "confidenceScore": 85.2,
        "cause": "Age-related damage to the macula",
        "severity": "Moderate",
        "suggestions": [
            "Regular monitoring with Amsler grid",
            "Take AREDS2 supplements if recommended",
            "Protect eyes from UV light",
            "Eat leafy green vegetables"
        ]
    },
    'hypertensive_retinopathy': {
        "problem": "Hypertensive Retinopathy",
        "confidenceScore": 76.8,
        "cause": "High blood pressure affecting retinal blood vessels",
        "severity": "Moderate",
        "suggestions": [
            "Control blood pressure",
            "Regular medical checkups",
            "Lifestyle modifications",
            "Medication compliance"
        ]
    }
}

def analyze_retina_image(image_path):
    """
    Mock AI analysis function
    In a real implementation, this would use a trained ML model
    """
    try:
        # Read the image
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError("Could not read image")
        
        # Get image properties
        height, width, channels = image.shape
        
        # Mock analysis based on image characteristics
        # In reality, this would be replaced with actual ML model inference
        
        # Simple heuristic: use image size and brightness to determine condition
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        brightness = np.mean(gray)
        
        # Mock classification logic
        if brightness < 100:
            condition = 'glaucoma'
        elif brightness < 150:
            condition = 'diabetic_retinopathy'
        elif brightness < 200:
            condition = 'macular_degeneration'
        else:
            condition = 'cataract'
        
        # Add some randomness to confidence score
        import random
        base_confidence = MOCK_RESPONSES[condition]['confidenceScore']
        confidence_variation = random.uniform(-5, 5)
        confidence = max(50, min(100, base_confidence + confidence_variation))
        
        result = MOCK_RESPONSES[condition].copy()
        result['confidenceScore'] = round(confidence, 1)
        
        logger.info(f"Analyzed image: {image_path}, Detected: {result['problem']}, Confidence: {confidence}%")
        
        return result
        
    except Exception as e:
        logger.error(f"Error analyzing image: {str(e)}")
        # Return a default response
        return {
            "problem": "Normal Retina",
            "confidenceScore": 95.0,
            "cause": "No significant abnormalities detected",
            "severity": "Low",
            "suggestions": [
                "Continue regular eye checkups",
                "Maintain healthy lifestyle",
                "Protect eyes from UV radiation"
            ]
        }

@app.route('/predict', methods=['POST'])
def predict():
    """
    Main prediction endpoint
    Expected request format:
    {
        "image_path": "/path/to/image.jpg",
        "image_data": "base64_encoded_image_data" (optional)
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "error": "No data provided"
            }), 400
        
        image_path = data.get('image_path')
        image_data = data.get('image_data')
        
        if not image_path and not image_data:
            return jsonify({
                "error": "Either image_path or image_data must be provided"
            }), 400
        
        # If base64 image data is provided, save it temporarily
        if image_data:
            try:
                # Decode base64 image
                image_bytes = base64.b64decode(image_data)
                
                # Create temporary file
                temp_path = f"temp_image_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
                with open(temp_path, 'wb') as f:
                    f.write(image_bytes)
                
                image_path = temp_path
                
            except Exception as e:
                return jsonify({
                    "error": f"Invalid image data: {str(e)}"
                }), 400
        
        # Analyze the image
        result = analyze_retina_image(image_path)
        
        # Clean up temporary file if created
        if image_data and os.path.exists(temp_path):
            os.remove(temp_path)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({
            "error": f"Prediction failed: {str(e)}"
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Eye Problem Detection AI Model",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })

@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information"""
    return jsonify({
        "service": "Eye Problem Detection AI Model",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "predict": "/predict (POST)"
        },
        "usage": {
            "predict": "Send POST request with image_path or image_data"
        }
    })

if __name__ == '__main__':
    # Create uploads directory if it doesn't exist
    os.makedirs('uploads', exist_ok=True)
    
    print("🚀 Starting Eye Problem Detection AI Model...")
    print("📊 Health check: http://localhost:8000/health")
    print("🔗 Prediction endpoint: http://localhost:8000/predict")
    
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True
    ) 