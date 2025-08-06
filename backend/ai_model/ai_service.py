"""
Enhanced AI Service for Retina Disease Detection
Integrates with trained TensorFlow models
"""

import os
import json
import numpy as np
import logging
from datetime import datetime
from typing import Dict, Tuple, Optional, List
import cv2
from PIL import Image
import io
import base64

# TensorFlow imports
try:
    import tensorflow as tf
    from tensorflow.keras.models import load_model
    from tensorflow.keras.preprocessing import image
    TENSORFLOW_AVAILABLE = True
except ImportError:
    TENSORFLOW_AVAILABLE = False
    print("Warning: TensorFlow not available. Using mock predictions.")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RetinaAIService:
    def __init__(self, model_path: str = 'models/retina_disease_model.h5'):
        """
        Initialize the AI service
        
        Args:
            model_path (str): Path to the trained model
        """
        self.model_path = model_path
        self.model = None
        self.model_info = None
        self.class_names = ['Normal', 'Cataract', 'Glaucoma', 'DiabeticRetinopathy']
        self.input_shape = (224, 224, 3)
        
        # Disease information database
        self.disease_info = {
            'Normal': {
                'description': 'No significant abnormalities detected in the retina',
                'severity': 'Low',
                'cause': 'Healthy retina',
                'suggestions': [
                    'Continue regular eye checkups',
                    'Maintain healthy lifestyle',
                    'Protect eyes from UV radiation',
                    'Eat a balanced diet rich in vitamins'
                ]
            },
            'Cataract': {
                'description': 'Clouding of the eye\'s natural lens affecting vision',
                'severity': 'Moderate',
                'cause': 'Age-related changes, UV exposure, diabetes, smoking',
                'suggestions': [
                    'Regular eye examinations',
                    'Wear sunglasses with UV protection',
                    'Consider surgery when vision affects daily activities',
                    'Maintain healthy diet rich in antioxidants',
                    'Quit smoking if applicable'
                ]
            },
            'Glaucoma': {
                'description': 'Increased pressure in the eye damaging the optic nerve',
                'severity': 'High',
                'cause': 'High eye pressure, family history, age, certain medical conditions',
                'suggestions': [
                    'Immediate consultation with ophthalmologist',
                    'Prescription eye drops as prescribed',
                    'Regular eye pressure monitoring',
                    'Avoid activities that increase eye pressure',
                    'Regular follow-ups with ophthalmologist'
                ]
            },
            'DiabeticRetinopathy': {
                'description': 'Diabetes affecting blood vessels in the retina',
                'severity': 'High',
                'cause': 'Long-term diabetes, poor blood sugar control',
                'suggestions': [
                    'Schedule regular eye checkups',
                    'Control blood sugar levels',
                    'Monitor blood pressure',
                    'Consider laser treatment if recommended',
                    'Quit smoking if applicable'
                ]
            }
        }
        
        # Load model if available
        self.load_model()
    
    def load_model(self) -> bool:
        """Load the trained TensorFlow model"""
        if not TENSORFLOW_AVAILABLE:
            logger.warning("TensorFlow not available. Using mock predictions.")
            return False
        
        if not os.path.exists(self.model_path):
            logger.warning(f"Model not found at {self.model_path}. Using mock predictions.")
            return False
        
        try:
            # Load the model
            self.model = load_model(self.model_path)
            
            # Load model info
            info_path = 'models/model_info.json'
            if os.path.exists(info_path):
                with open(info_path, 'r') as f:
                    self.model_info = json.load(f)
                    self.class_names = self.model_info.get('class_names', self.class_names)
                    self.input_shape = tuple(self.model_info.get('input_shape', self.input_shape))
            
            logger.info(f"Model loaded successfully from {self.model_path}")
            logger.info(f"Model info: {self.model_info}")
            return True
            
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            return False
    
    def preprocess_image(self, image_path: str) -> np.ndarray:
        """
        Preprocess image for model prediction
        
        Args:
            image_path (str): Path to the image file
            
        Returns:
            np.ndarray: Preprocessed image array
        """
        try:
            # Load and resize image
            img = image.load_img(image_path, target_size=self.input_shape[:2])
            img_array = image.img_to_array(img)
            
            # Normalize
            img_array = img_array / 255.0
            
            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)
            
            return img_array
            
        except Exception as e:
            logger.error(f"Error preprocessing image: {e}")
            raise
    
    def predict_image(self, image_path: str) -> Dict:
        """
        Predict disease from image
        
        Args:
            image_path (str): Path to the image file
            
        Returns:
            Dict: Prediction results
        """
        try:
            if self.model is None:
                # Use mock prediction if model not available
                return self._mock_prediction(image_path)
            
            # Preprocess image
            img_array = self.preprocess_image(image_path)
            
            # Make prediction
            predictions = self.model.predict(img_array, verbose=0)
            
            # Get predicted class and confidence
            predicted_class_idx = np.argmax(predictions[0])
            confidence = float(np.max(predictions[0]))
            predicted_class = self.class_names[predicted_class_idx]
            
            # Get all class probabilities
            class_probabilities = {
                class_name: float(prob) 
                for class_name, prob in zip(self.class_names, predictions[0])
            }
            
            # Get disease information
            disease_info = self.disease_info.get(predicted_class, {})
            
            result = {
                'problem': predicted_class,
                'confidenceScore': round(confidence * 100, 2),
                'cause': disease_info.get('cause', 'Unknown'),
                'severity': disease_info.get('severity', 'Low'),
                'suggestions': disease_info.get('suggestions', []),
                'description': disease_info.get('description', ''),
                'class_probabilities': class_probabilities,
                'model_used': 'tensorflow',
                'prediction_timestamp': datetime.now().isoformat()
            }
            
            logger.info(f"Prediction: {predicted_class} (Confidence: {confidence:.2f})")
            return result
            
        except Exception as e:
            logger.error(f"Error in prediction: {e}")
            return self._mock_prediction(image_path)
    
    def predict_from_base64(self, base64_image: str) -> Dict:
        """
        Predict disease from base64 encoded image
        
        Args:
            base64_image (str): Base64 encoded image string
            
        Returns:
            Dict: Prediction results
        """
        try:
            # Decode base64 image
            image_data = base64.b64decode(base64_image)
            img = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize image
            img = img.resize(self.input_shape[:2])
            
            # Convert to array and normalize
            img_array = np.array(img) / 255.0
            img_array = np.expand_dims(img_array, axis=0)
            
            if self.model is None:
                return self._mock_prediction_from_array(img_array)
            
            # Make prediction
            predictions = self.model.predict(img_array, verbose=0)
            
            # Get predicted class and confidence
            predicted_class_idx = np.argmax(predictions[0])
            confidence = float(np.max(predictions[0]))
            predicted_class = self.class_names[predicted_class_idx]
            
            # Get disease information
            disease_info = self.disease_info.get(predicted_class, {})
            
            result = {
                'problem': predicted_class,
                'confidenceScore': round(confidence * 100, 2),
                'cause': disease_info.get('cause', 'Unknown'),
                'severity': disease_info.get('severity', 'Low'),
                'suggestions': disease_info.get('suggestions', []),
                'description': disease_info.get('description', ''),
                'model_used': 'tensorflow',
                'prediction_timestamp': datetime.now().isoformat()
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error in base64 prediction: {e}")
            return self._mock_prediction_from_array(None)
    
    def _mock_prediction(self, image_path: str) -> Dict:
        """Generate mock prediction when model is not available"""
        import random
        
        # Simple heuristic based on image properties
        try:
            img = cv2.imread(image_path)
            if img is not None:
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                brightness = np.mean(gray)
                
                # Simple classification based on brightness
                if brightness < 100:
                    problem = 'Glaucoma'
                elif brightness < 150:
                    problem = 'DiabeticRetinopathy'
                elif brightness < 200:
                    problem = 'Cataract'
                else:
                    problem = 'Normal'
            else:
                problem = random.choice(self.class_names)
        except:
            problem = random.choice(self.class_names)
        
        # Add some randomness to confidence
        confidence = random.uniform(0.7, 0.95)
        
        disease_info = self.disease_info.get(problem, {})
        
        return {
            'problem': problem,
            'confidenceScore': round(confidence * 100, 2),
            'cause': disease_info.get('cause', 'Unknown'),
            'severity': disease_info.get('severity', 'Low'),
            'suggestions': disease_info.get('suggestions', []),
            'description': disease_info.get('description', ''),
            'model_used': 'mock',
            'prediction_timestamp': datetime.now().isoformat()
        }
    
    def _mock_prediction_from_array(self, img_array: Optional[np.ndarray]) -> Dict:
        """Generate mock prediction from image array"""
        import random
        
        problem = random.choice(self.class_names)
        confidence = random.uniform(0.7, 0.95)
        
        disease_info = self.disease_info.get(problem, {})
        
        return {
            'problem': problem,
            'confidenceScore': round(confidence * 100, 2),
            'cause': disease_info.get('cause', 'Unknown'),
            'severity': disease_info.get('severity', 'Low'),
            'suggestions': disease_info.get('suggestions', []),
            'description': disease_info.get('description', ''),
            'model_used': 'mock',
            'prediction_timestamp': datetime.now().isoformat()
        }
    
    def get_model_status(self) -> Dict:
        """Get the status of the AI model"""
        return {
            'model_loaded': self.model is not None,
            'model_path': self.model_path,
            'model_info': self.model_info,
            'class_names': self.class_names,
            'input_shape': self.input_shape,
            'tensorflow_available': TENSORFLOW_AVAILABLE
        }
    
    def get_disease_info(self, disease_name: str) -> Dict:
        """Get detailed information about a specific disease"""
        return self.disease_info.get(disease_name, {})
    
    def get_all_diseases(self) -> List[str]:
        """Get list of all supported diseases"""
        return list(self.disease_info.keys())

# Global AI service instance
ai_service = None

def get_ai_service() -> RetinaAIService:
    """Get or create the global AI service instance"""
    global ai_service
    if ai_service is None:
        ai_service = RetinaAIService()
    return ai_service

def analyze_retina_image(image_path: str) -> Dict:
    """
    Analyze retina image using AI model
    
    Args:
        image_path (str): Path to the image file
        
    Returns:
        Dict: Analysis results
    """
    service = get_ai_service()
    return service.predict_image(image_path)

def analyze_retina_image_base64(base64_image: str) -> Dict:
    """
    Analyze retina image from base64 string
    
    Args:
        base64_image (str): Base64 encoded image
        
    Returns:
        Dict: Analysis results
    """
    service = get_ai_service()
    return service.predict_from_base64(base64_image)

def get_medicine_suggestions(problem: str) -> List[str]:
    """Get medicine suggestions for a specific problem"""
    medicine_database = {
        'DiabeticRetinopathy': [
            'Anti-VEGF injections (Lucentis, Avastin)',
            'Corticosteroid implants',
            'Laser photocoagulation treatment',
            'Blood sugar control medications'
        ],
        'Glaucoma': [
            'Prostaglandin analogs (Latanoprost)',
            'Beta blockers (Timolol)',
            'Alpha agonists (Brimonidine)',
            'Carbonic anhydrase inhibitors',
            'Combination eye drops'
        ],
        'Cataract': [
            'Surgery is the primary treatment',
            'Pre-surgery: Lubricating eye drops',
            'Post-surgery: Anti-inflammatory drops',
            'Antibiotic eye drops'
        ],
        'Normal': [
            'No medication required',
            'Regular eye checkups',
            'Maintain healthy lifestyle'
        ]
    }
    
    return medicine_database.get(problem, [
        'Consult with an ophthalmologist',
        'Regular eye checkups',
        'Maintain healthy lifestyle'
    ])

def get_care_tips(problem: str) -> List[str]:
    """Get care tips for a specific problem"""
    tips_database = {
        'DiabeticRetinopathy': [
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
        'Normal': [
            'Regular eye checkups',
            'Protect eyes from UV radiation',
            'Maintain healthy lifestyle',
            'Avoid smoking',
            'Eat a balanced diet rich in vitamins'
        ]
    }
    
    return tips_database.get(problem, [
        'Regular eye checkups',
        'Protect eyes from UV radiation',
        'Maintain healthy lifestyle',
        'Avoid smoking',
        'Eat a balanced diet rich in vitamins'
    ]) 