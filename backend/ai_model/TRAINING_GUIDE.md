# 🧠 Retina Disease Detection Model Training Guide

Complete guide to train your own deep learning model for retina disease detection using TensorFlow/Keras.

## 📋 Prerequisites

### Required Software
- Python 3.8+
- TensorFlow 2.15+
- CUDA (optional, for GPU acceleration)
- Git

### Required Hardware
- **Minimum**: 8GB RAM, CPU
- **Recommended**: 16GB+ RAM, GPU (NVIDIA)
- **Cloud**: Google Colab (free GPU), AWS, or Azure

## 🗂️ Dataset Preparation

### 1. Dataset Sources

#### Free Datasets
- **DIARETDB1**: 89 images with diabetic retinopathy
- **MESSIDOR**: 1200+ retina images
- **Kaggle EyePACS**: 88,000+ fundus images
- **APTOS**: 3,662 images with diabetic retinopathy

#### Dataset Download Links
```bash
# Kaggle EyePACS (requires Kaggle account)
kaggle datasets download -d andrewmvd/retinal-disease-classification

# APTOS (requires Kaggle account)
kaggle competitions download -c aptos2019-blindness-detection
```

### 2. Dataset Organization

#### Expected Structure
```
dataset/
├── Normal/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
├── Cataract/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
├── Glaucoma/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
└── DiabeticRetinopathy/
    ├── image1.jpg
    ├── image2.jpg
    └── ...
```

#### Using the Dataset Preparation Script
```bash
# Navigate to AI model directory
cd backend/ai_model

# Run dataset preparation
python prepare_dataset.py
```

### 3. Dataset Validation

#### Image Requirements
- **Format**: JPG, PNG, BMP, TIFF
- **Minimum Size**: 100x100 pixels
- **Recommended Size**: 224x224 or 512x512
- **Color**: RGB or Grayscale

#### Quality Checks
```python
# Run validation
python prepare_dataset.py

# Check statistics
python -c "
from prepare_dataset import DatasetPreparator
preparator = DatasetPreparator('dataset')
preparator.print_dataset_stats()
"
```

## 🏗️ Model Architecture

### Transfer Learning Models

#### 1. MobileNetV2 (Recommended for Mobile/Edge)
- **Pros**: Fast, lightweight, good accuracy
- **Cons**: Slightly lower accuracy than EfficientNet
- **Use Case**: Real-time applications, mobile apps

#### 2. EfficientNetB0 (Recommended for Best Accuracy)
- **Pros**: High accuracy, good efficiency
- **Cons**: Larger model size
- **Use Case**: High-accuracy applications, server deployment

### Model Configuration

#### Input Parameters
```python
# Model configuration
MODEL_TYPE = 'efficientnet'  # or 'mobilenet'
INPUT_SHAPE = (224, 224, 3)
NUM_CLASSES = 4
BATCH_SIZE = 32
EPOCHS = 15
FINE_TUNE_EPOCHS = 8
```

## 🚀 Training Process

### 1. Environment Setup

#### Install Dependencies
```bash
# Install Python dependencies
pip install -r requirements.txt

# Verify TensorFlow installation
python -c "import tensorflow as tf; print(tf.__version__)"
```

#### GPU Setup (Optional)
```bash
# Check GPU availability
python -c "import tensorflow as tf; print('GPU Available:', tf.config.list_physical_devices('GPU'))"

# For CUDA setup, follow TensorFlow GPU guide
# https://www.tensorflow.org/install/gpu
```

### 2. Training Configuration

#### Basic Training
```bash
# Navigate to AI model directory
cd backend/ai_model

# Run training with default settings
python train_model.py
```

#### Custom Training
```python
# Custom training script
from train_model import RetinaDiseaseModel

# Create model instance
model = RetinaDiseaseModel(
    model_type='efficientnet',
    input_shape=(224, 224, 3),
    num_classes=4
)

# Build model
model.build_model()

# Prepare data
model.prepare_data('dataset', batch_size=32)

# Train model
history = model.train_model(epochs=20, fine_tune_epochs=10)

# Evaluate model
results = model.evaluate_model()

# Save model
model.save_model('models/my_retina_model.h5')
```

### 3. Training Parameters

#### Learning Rate Schedule
```python
# Initial learning rate
initial_lr = 0.001

# Fine-tuning learning rate
fine_tune_lr = 1e-5

# Learning rate reduction
reduce_lr_factor = 0.2
reduce_lr_patience = 3
```

#### Data Augmentation
```python
# Training augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    horizontal_flip=True,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    zoom_range=0.2,
    shear_range=0.2,
    fill_mode='nearest'
)

# Validation (only rescaling)
val_datagen = ImageDataGenerator(
    rescale=1./255
)
```

### 4. Training Monitoring

#### Callbacks
```python
callbacks = [
    # Model checkpointing
    ModelCheckpoint(
        'models/best_model.h5',
        monitor='val_accuracy',
        save_best_only=True,
        mode='max'
    ),
    
    # Early stopping
    EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True
    ),
    
    # Learning rate reduction
    ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.2,
        patience=3,
        min_lr=1e-7
    )
]
```

## 📊 Model Evaluation

### 1. Performance Metrics

#### Accuracy Metrics
- **Overall Accuracy**: Percentage of correct predictions
- **Top-2 Accuracy**: Percentage of correct predictions in top 2
- **Per-class Accuracy**: Accuracy for each disease class

#### Loss Metrics
- **Training Loss**: Loss on training data
- **Validation Loss**: Loss on validation data
- **Overfitting Detection**: Gap between training and validation loss

### 2. Evaluation Script
```python
# Evaluate trained model
from train_model import RetinaDiseaseModel

# Load trained model
model = RetinaDiseaseModel()
model.load_model('models/retina_disease_model.h5')

# Evaluate
results = model.evaluate_model()
print(f"Validation Accuracy: {results['accuracy']:.4f}")
print(f"Top-2 Accuracy: {results['top_2_accuracy']:.4f}")

# Plot training history
model.plot_training_history()
```

### 3. Confusion Matrix
```python
import numpy as np
from sklearn.metrics import confusion_matrix, classification_report
import seaborn as sns
import matplotlib.pyplot as plt

# Generate predictions
predictions = model.model.predict(val_generator)
y_pred = np.argmax(predictions, axis=1)
y_true = val_generator.classes

# Create confusion matrix
cm = confusion_matrix(y_true, y_pred)

# Plot confusion matrix
plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=model.class_names,
            yticklabels=model.class_names)
plt.title('Confusion Matrix')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.show()

# Print classification report
print(classification_report(y_true, y_pred, target_names=model.class_names))
```

## 🔧 Model Optimization

### 1. Hyperparameter Tuning

#### Learning Rate
```python
# Test different learning rates
learning_rates = [0.001, 0.0001, 0.00001]

for lr in learning_rates:
    model.compile(optimizer=Adam(learning_rate=lr), ...)
    # Train and evaluate
```

#### Batch Size
```python
# Test different batch sizes
batch_sizes = [16, 32, 64]

for batch_size in batch_sizes:
    # Prepare data with different batch size
    # Train and evaluate
```

### 2. Model Architecture Tuning

#### Different Base Models
```python
# Test different base models
base_models = {
    'mobilenet': MobileNetV2,
    'efficientnet': EfficientNetB0,
    'resnet': ResNet50,
    'densenet': DenseNet121
}
```

#### Custom Top Layers
```python
# Experiment with different top layer architectures
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.5)(x)  # Try different dropout rates
x = Dense(512, activation='relu')(x)  # Try different layer sizes
x = Dropout(0.3)(x)
predictions = Dense(num_classes, activation='softmax')(x)
```

## 💾 Model Deployment

### 1. Model Saving
```python
# Save the trained model
model.save_model('models/retina_disease_model.h5')

# Model will be saved with metadata
# - Model architecture
# - Weights
# - Training configuration
# - Class names
```

### 2. Model Loading
```python
# Load the trained model
from ai_service import RetinaAIService

ai_service = RetinaAIService('models/retina_disease_model.h5')
result = ai_service.predict_image('test_image.jpg')
```

### 3. Integration with Backend
```bash
# Set environment variable to use trained model
export USE_PYTHON_AI=true

# Start the backend
npm run dev
```

## 🧪 Testing and Validation

### 1. Single Image Testing
```python
# Test single image
from ai_service import analyze_retina_image

result = analyze_retina_image('test_image.jpg')
print(f"Predicted: {result['problem']}")
print(f"Confidence: {result['confidenceScore']}%")
```

### 2. Batch Testing
```python
# Test multiple images
import os

test_dir = 'test_images'
results = []

for image_file in os.listdir(test_dir):
    if image_file.lower().endswith(('.jpg', '.png', '.jpeg')):
        image_path = os.path.join(test_dir, image_file)
        result = analyze_retina_image(image_path)
        results.append({
            'image': image_file,
            'prediction': result
        })

# Print results
for result in results:
    print(f"{result['image']}: {result['prediction']['problem']} ({result['prediction']['confidenceScore']}%)")
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Out of Memory
```python
# Reduce batch size
BATCH_SIZE = 16  # or even 8

# Reduce image size
INPUT_SHAPE = (128, 128, 3)

# Use mixed precision
tf.keras.mixed_precision.set_global_policy('mixed_float16')
```

#### 2. Overfitting
```python
# Increase dropout
x = Dropout(0.5)(x)

# Add more regularization
x = Dense(128, activation='relu', kernel_regularizer=l2(0.01))(x)

# Reduce model complexity
# Use fewer layers or smaller layers
```

#### 3. Poor Performance
```python
# Check dataset balance
# Use class weights
class_weights = compute_class_weight('balanced', classes, y_train)

# Use data augmentation
# Increase training data

# Try different architectures
# Fine-tune more layers
```

#### 4. Slow Training
```python
# Use GPU
# Reduce image size
# Use smaller batch size
# Use mixed precision training
```

## 📈 Performance Benchmarks

### Expected Performance
- **MobileNetV2**: 85-90% accuracy
- **EfficientNetB0**: 90-95% accuracy
- **Training Time**: 2-6 hours (GPU), 8-24 hours (CPU)

### Optimization Tips
1. **Use GPU**: 10x faster training
2. **Data Augmentation**: Improves generalization
3. **Transfer Learning**: Better than training from scratch
4. **Fine-tuning**: Improves accuracy by 5-10%
5. **Ensemble Models**: Combine multiple models for better accuracy

## 🔄 Continuous Improvement

### 1. Model Updates
- Retrain with new data
- Fine-tune with domain-specific images
- Update model architecture

### 2. Data Collection
- Collect more diverse images
- Improve image quality
- Add new disease classes

### 3. Performance Monitoring
- Monitor model performance in production
- Collect feedback from users
- A/B test different models

---

## 📚 Additional Resources

### Documentation
- [TensorFlow Guide](https://www.tensorflow.org/guide)
- [Keras Documentation](https://keras.io/)
- [Transfer Learning Guide](https://www.tensorflow.org/tutorials/images/transfer_learning)

### Research Papers
- [MobileNetV2](https://arxiv.org/abs/1801.04381)
- [EfficientNet](https://arxiv.org/abs/1905.11946)
- [Retina Disease Detection](https://www.nature.com/articles/s41598-020-71908-9)

### Datasets
- [Kaggle EyePACS](https://www.kaggle.com/c/diabetic-retinopathy-detection)
- [APTOS](https://www.kaggle.com/c/aptos2019-blindness-detection)
- [MESSIDOR](http://www.adcis.net/en/Download-Third-Party/Messidor.html)

---

**🎉 You're now ready to train your own retina disease detection model!** 