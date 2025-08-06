"""
Test script for the Retina Disease Detection AI Model
"""

import os
import sys
import json
from pathlib import Path

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_service import RetinaAIService, analyze_retina_image

def test_ai_service():
    """Test the AI service functionality"""
    print("🧪 Testing Retina Disease Detection AI Service")
    print("=" * 50)
    
    # Create AI service instance
    ai_service = RetinaAIService()
    
    # Test model status
    print("\n1. Model Status:")
    status = ai_service.get_model_status()
    for key, value in status.items():
        print(f"   {key}: {value}")
    
    # Test disease information
    print("\n2. Disease Information:")
    for disease in ai_service.get_all_diseases():
        info = ai_service.get_disease_info(disease)
        print(f"   {disease}: {info.get('description', 'No description')}")
    
    # Test mock prediction
    print("\n3. Mock Prediction Test:")
    mock_result = ai_service._mock_prediction("test_image.jpg")
    print(f"   Predicted: {mock_result['problem']}")
    print(f"   Confidence: {mock_result['confidenceScore']}%")
    print(f"   Severity: {mock_result['severity']}")
    print(f"   Model Used: {mock_result['model_used']}")
    
    # Test medicine suggestions
    print("\n4. Medicine Suggestions:")
    medicines = ai_service.get_medicine_suggestions(mock_result['problem'])
    for i, medicine in enumerate(medicines, 1):
        print(f"   {i}. {medicine}")
    
    # Test care tips
    print("\n5. Care Tips:")
    tips = ai_service.get_care_tips(mock_result['problem'])
    for i, tip in enumerate(tips, 1):
        print(f"   {i}. {tip}")
    
    print("\n✅ AI Service test completed successfully!")

def test_model_prediction(image_path=None):
    """Test model prediction with a real image"""
    print("\n🧪 Testing Model Prediction")
    print("=" * 30)
    
    if image_path and os.path.exists(image_path):
        print(f"Testing with image: {image_path}")
        try:
            result = analyze_retina_image(image_path)
            print(f"   Predicted: {result['problem']}")
            print(f"   Confidence: {result['confidenceScore']}%")
            print(f"   Severity: {result['severity']}")
            print(f"   Model Used: {result['model_used']}")
            print(f"   Cause: {result['cause']}")
            print(f"   Suggestions: {len(result['suggestions'])} items")
        except Exception as e:
            print(f"   Error: {e}")
    else:
        print("No valid image path provided. Using mock prediction.")
        result = analyze_retina_image("mock_image.jpg")
        print(f"   Mock Prediction: {result['problem']} ({result['confidenceScore']}%)")

def test_base64_prediction():
    """Test base64 image prediction"""
    print("\n🧪 Testing Base64 Prediction")
    print("=" * 30)
    
    # Create a simple test image (1x1 pixel, red)
    import base64
    from PIL import Image
    import io
    
    # Create a simple test image
    img = Image.new('RGB', (224, 224), color='red')
    img_buffer = io.BytesIO()
    img.save(img_buffer, format='JPEG')
    img_buffer.seek(0)
    
    # Convert to base64
    base64_image = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
    
    try:
        from ai_service import analyze_retina_image_base64
        result = analyze_retina_image_base64(base64_image)
        print(f"   Base64 Prediction: {result['problem']} ({result['confidenceScore']}%)")
    except Exception as e:
        print(f"   Base64 Error: {e}")

def create_sample_dataset():
    """Create a sample dataset structure"""
    print("\n📁 Creating Sample Dataset Structure")
    print("=" * 40)
    
    dataset_dir = Path("sample_dataset")
    classes = ['Normal', 'Cataract', 'Glaucoma', 'DiabeticRetinopathy']
    
    # Create directory structure
    for class_name in classes:
        class_dir = dataset_dir / class_name
        class_dir.mkdir(parents=True, exist_ok=True)
        print(f"   Created: {class_dir}")
    
    # Create a sample README
    readme_content = """# Sample Dataset

This is a sample dataset structure for retina disease detection.

## Structure
- Normal/: Images of normal retinas
- Cataract/: Images with cataract
- Glaucoma/: Images with glaucoma
- DiabeticRetinopathy/: Images with diabetic retinopathy

## Usage
1. Replace this directory with your actual dataset
2. Ensure images are in JPG, PNG, or similar formats
3. Run the training script: python train_model.py

## Expected Performance
- MobileNetV2: 85-90% accuracy
- EfficientNetB0: 90-95% accuracy
"""
    
    with open(dataset_dir / "README.md", "w") as f:
        f.write(readme_content)
    
    print(f"   Created: {dataset_dir}/README.md")
    print("   ✅ Sample dataset structure created!")
    print("   📝 Add your images to the respective class folders")

def main():
    """Main test function"""
    print("🚀 Retina Disease Detection AI Model Test Suite")
    print("=" * 60)
    
    # Test AI service
    test_ai_service()
    
    # Test model prediction (if image provided)
    if len(sys.argv) > 1:
        test_model_prediction(sys.argv[1])
    else:
        test_model_prediction()
    
    # Test base64 prediction
    test_base64_prediction()
    
    # Create sample dataset
    create_sample_dataset()
    
    print("\n" + "=" * 60)
    print("🎉 All tests completed!")
    print("\n📚 Next Steps:")
    print("1. Add your dataset to the 'sample_dataset' directory")
    print("2. Run: python train_model.py")
    print("3. Test with: python test_model.py your_image.jpg")
    print("4. Integrate with backend: export USE_PYTHON_AI=true")

if __name__ == "__main__":
    main() 