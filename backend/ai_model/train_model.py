"""
Retina Disease Detection Model Training Script
Uses transfer learning with MobileNetV2 or EfficientNetB0
"""

import tensorflow as tf
import numpy as np
import os
import matplotlib.pyplot as plt
from tensorflow.keras.applications import MobileNetV2, EfficientNetB0
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam
import json
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RetinaDiseaseModel:
    def __init__(self, model_type='mobilenet', input_shape=(224, 224, 3), num_classes=4):
        """
        Initialize the retina disease detection model
        
        Args:
            model_type (str): 'mobilenet' or 'efficientnet'
            input_shape (tuple): Input image shape
            num_classes (int): Number of disease classes
        """
        self.model_type = model_type
        self.input_shape = input_shape
        self.num_classes = num_classes
        self.model = None
        self.history = None
        self.class_names = ['Normal', 'Cataract', 'Glaucoma', 'DiabeticRetinopathy']
        
    def build_model(self):
        """Build the transfer learning model"""
        logger.info(f"Building {self.model_type} model...")
        
        if self.model_type == 'mobilenet':
            base_model = MobileNetV2(
                include_top=False, 
                weights='imagenet', 
                input_shape=self.input_shape
            )
        elif self.model_type == 'efficientnet':
            base_model = EfficientNetB0(
                include_top=False, 
                weights='imagenet', 
                input_shape=self.input_shape
            )
        else:
            raise ValueError("model_type must be 'mobilenet' or 'efficientnet'")
        
        # Freeze the base model
        base_model.trainable = False
        
        # Build the top layers
        x = base_model.output
        x = GlobalAveragePooling2D()(x)
        x = Dropout(0.3)(x)
        x = Dense(256, activation='relu')(x)
        x = Dropout(0.3)(x)
        x = Dense(128, activation='relu')(x)
        x = Dropout(0.2)(x)
        predictions = Dense(self.num_classes, activation='softmax')(x)
        
        self.model = Model(inputs=base_model.input, outputs=predictions)
        
        # Compile the model
        self.model.compile(
            optimizer=Adam(learning_rate=0.001),
            loss='categorical_crossentropy',
            metrics=['accuracy', 'top_2_accuracy']
        )
        
        logger.info("Model built successfully!")
        return self.model
    
    def prepare_data(self, dataset_path, batch_size=32, validation_split=0.2):
        """Prepare data generators for training"""
        logger.info("Preparing data generators...")
        
        # Data augmentation for training
        train_datagen = ImageDataGenerator(
            rescale=1./255,
            validation_split=validation_split,
            horizontal_flip=True,
            vertical_flip=False,
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            zoom_range=0.2,
            shear_range=0.2,
            fill_mode='nearest'
        )
        
        # Only rescaling for validation
        val_datagen = ImageDataGenerator(
            rescale=1./255,
            validation_split=validation_split
        )
        
        # Training generator
        self.train_generator = train_datagen.flow_from_directory(
            dataset_path,
            target_size=(self.input_shape[0], self.input_shape[1]),
            batch_size=batch_size,
            class_mode='categorical',
            subset='training',
            shuffle=True
        )
        
        # Validation generator
        self.val_generator = val_datagen.flow_from_directory(
            dataset_path,
            target_size=(self.input_shape[0], self.input_shape[1]),
            batch_size=batch_size,
            class_mode='categorical',
            subset='validation',
            shuffle=False
        )
        
        logger.info(f"Training samples: {self.train_generator.samples}")
        logger.info(f"Validation samples: {self.val_generator.samples}")
        logger.info(f"Classes: {list(self.train_generator.class_indices.keys())}")
        
        return self.train_generator, self.val_generator
    
    def train_model(self, epochs=20, fine_tune_epochs=10):
        """Train the model with initial training and fine-tuning"""
        if self.model is None:
            self.build_model()
        
        # Create callbacks
        callbacks = [
            ModelCheckpoint(
                'models/best_model.h5',
                monitor='val_accuracy',
                save_best_only=True,
                mode='max',
                verbose=1
            ),
            EarlyStopping(
                monitor='val_loss',
                patience=5,
                restore_best_weights=True,
                verbose=1
            ),
            ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.2,
                patience=3,
                min_lr=1e-7,
                verbose=1
            )
        ]
        
        # Initial training with frozen base
        logger.info("Starting initial training...")
        self.history = self.model.fit(
            self.train_generator,
            epochs=epochs,
            validation_data=self.val_generator,
            callbacks=callbacks,
            verbose=1
        )
        
        # Fine-tuning: unfreeze some layers
        logger.info("Starting fine-tuning...")
        self.fine_tune_model(fine_tune_epochs)
        
        return self.history
    
    def fine_tune_model(self, epochs=10):
        """Fine-tune the model by unfreezing some base layers"""
        # Unfreeze the top layers of the base model
        if self.model_type == 'mobilenet':
            # Unfreeze the last 30 layers
            for layer in self.model.layers[-30:]:
                layer.trainable = True
        elif self.model_type == 'efficientnet':
            # Unfreeze the last 20 layers
            for layer in self.model.layers[-20:]:
                layer.trainable = True
        
        # Recompile with lower learning rate
        self.model.compile(
            optimizer=Adam(learning_rate=1e-5),
            loss='categorical_crossentropy',
            metrics=['accuracy', 'top_2_accuracy']
        )
        
        # Fine-tune
        fine_tune_history = self.model.fit(
            self.train_generator,
            epochs=epochs,
            validation_data=self.val_generator,
            callbacks=[
                ModelCheckpoint(
                    'models/fine_tuned_model.h5',
                    monitor='val_accuracy',
                    save_best_only=True,
                    mode='max',
                    verbose=1
                ),
                EarlyStopping(
                    monitor='val_loss',
                    patience=3,
                    restore_best_weights=True,
                    verbose=1
                )
            ],
            verbose=1
        )
        
        # Combine histories
        if self.history is not None:
            for key in self.history.history:
                self.history.history[key].extend(fine_tune_history.history[key])
        
        return fine_tune_history
    
    def evaluate_model(self):
        """Evaluate the trained model"""
        if self.model is None:
            logger.error("No model to evaluate. Train the model first.")
            return None
        
        logger.info("Evaluating model...")
        evaluation = self.model.evaluate(self.val_generator, verbose=1)
        
        results = {
            'loss': evaluation[0],
            'accuracy': evaluation[1],
            'top_2_accuracy': evaluation[2]
        }
        
        logger.info(f"Validation Loss: {results['loss']:.4f}")
        logger.info(f"Validation Accuracy: {results['accuracy']:.4f}")
        logger.info(f"Top-2 Accuracy: {results['top_2_accuracy']:.4f}")
        
        return results
    
    def predict_single(self, img_path):
        """Predict a single image"""
        if self.model is None:
            logger.error("No model loaded. Load or train the model first.")
            return None, 0
        
        from tensorflow.keras.preprocessing import image
        
        # Load and preprocess image
        img = image.load_img(img_path, target_size=(self.input_shape[0], self.input_shape[1]))
        img_array = image.img_to_array(img)
        img_array = img_array / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Make prediction
        predictions = self.model.predict(img_array)
        predicted_class = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))
        
        return self.class_names[predicted_class], confidence
    
    def save_model(self, model_path='models/retina_disease_model.h5'):
        """Save the trained model"""
        if self.model is None:
            logger.error("No model to save. Train the model first.")
            return
        
        # Create models directory if it doesn't exist
        os.makedirs('models', exist_ok=True)
        
        # Save the model
        self.model.save(model_path)
        
        # Save model info
        model_info = {
            'model_type': self.model_type,
            'input_shape': self.input_shape,
            'num_classes': self.num_classes,
            'class_names': self.class_names,
            'training_date': datetime.now().isoformat(),
            'model_path': model_path
        }
        
        with open('models/model_info.json', 'w') as f:
            json.dump(model_info, f, indent=2)
        
        logger.info(f"Model saved to {model_path}")
        logger.info("Model info saved to models/model_info.json")
    
    def load_model(self, model_path='models/retina_disease_model.h5'):
        """Load a trained model"""
        if not os.path.exists(model_path):
            logger.error(f"Model file not found: {model_path}")
            return False
        
        try:
            self.model = load_model(model_path)
            
            # Load model info
            info_path = 'models/model_info.json'
            if os.path.exists(info_path):
                with open(info_path, 'r') as f:
                    model_info = json.load(f)
                    self.model_type = model_info.get('model_type', 'mobilenet')
                    self.input_shape = tuple(model_info.get('input_shape', (224, 224, 3)))
                    self.num_classes = model_info.get('num_classes', 4)
                    self.class_names = model_info.get('class_names', ['Normal', 'Cataract', 'Glaucoma', 'DiabeticRetinopathy'])
            
            logger.info(f"Model loaded from {model_path}")
            return True
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            return False
    
    def plot_training_history(self, save_path='models/training_history.png'):
        """Plot training history"""
        if self.history is None:
            logger.error("No training history available. Train the model first.")
            return
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))
        
        # Plot accuracy
        ax1.plot(self.history.history['accuracy'], label='Training Accuracy')
        ax1.plot(self.history.history['val_accuracy'], label='Validation Accuracy')
        ax1.set_title('Model Accuracy')
        ax1.set_xlabel('Epoch')
        ax1.set_ylabel('Accuracy')
        ax1.legend()
        ax1.grid(True)
        
        # Plot loss
        ax2.plot(self.history.history['loss'], label='Training Loss')
        ax2.plot(self.history.history['val_loss'], label='Validation Loss')
        ax2.set_title('Model Loss')
        ax2.set_xlabel('Epoch')
        ax2.set_ylabel('Loss')
        ax2.legend()
        ax2.grid(True)
        
        plt.tight_layout()
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        plt.show()
        
        logger.info(f"Training history plot saved to {save_path}")

def main():
    """Main training function"""
    # Configuration
    DATASET_PATH = 'dataset'  # Path to your dataset
    MODEL_TYPE = 'efficientnet'  # 'mobilenet' or 'efficientnet'
    EPOCHS = 15
    FINE_TUNE_EPOCHS = 8
    BATCH_SIZE = 32
    
    # Check if dataset exists
    if not os.path.exists(DATASET_PATH):
        logger.error(f"Dataset not found at {DATASET_PATH}")
        logger.info("Please organize your dataset as follows:")
        logger.info(f"{DATASET_PATH}/")
        logger.info("  ├── Normal/")
        logger.info("  ├── Cataract/")
        logger.info("  ├── Glaucoma/")
        logger.info("  └── DiabeticRetinopathy/")
        return
    
    # Create model instance
    model = RetinaDiseaseModel(model_type=MODEL_TYPE)
    
    # Build model
    model.build_model()
    
    # Prepare data
    model.prepare_data(DATASET_PATH, batch_size=BATCH_SIZE)
    
    # Train model
    history = model.train_model(epochs=EPOCHS, fine_tune_epochs=FINE_TUNE_EPOCHS)
    
    # Evaluate model
    results = model.evaluate_model()
    
    # Save model
    model.save_model()
    
    # Plot training history
    model.plot_training_history()
    
    logger.info("Training completed successfully!")

if __name__ == "__main__":
    main() 