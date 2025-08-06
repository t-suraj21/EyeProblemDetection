"""
Dataset Preparation Script for Retina Disease Detection
Helps organize and prepare datasets for training
"""

import os
import shutil
import random
from pathlib import Path
import logging
from typing import List, Dict, Tuple
import cv2
import numpy as np
from PIL import Image

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatasetPreparator:
    def __init__(self, source_dir: str, output_dir: str = 'dataset'):
        """
        Initialize dataset preparator
        
        Args:
            source_dir (str): Source directory containing images
            output_dir (str): Output directory for organized dataset
        """
        self.source_dir = Path(source_dir)
        self.output_dir = Path(output_dir)
        self.classes = ['Normal', 'Cataract', 'Glaucoma', 'DiabeticRetinopathy']
        
        # Create output directory structure
        self._create_directory_structure()
    
    def _create_directory_structure(self):
        """Create the directory structure for the dataset"""
        for class_name in self.classes:
            class_dir = self.output_dir / class_name
            class_dir.mkdir(parents=True, exist_ok=True)
            logger.info(f"Created directory: {class_dir}")
    
    def organize_by_filename(self, filename_patterns: Dict[str, List[str]]):
        """
        Organize images based on filename patterns
        
        Args:
            filename_patterns (Dict): Dictionary mapping class names to filename patterns
        """
        logger.info("Organizing images by filename patterns...")
        
        # Get all image files
        image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif'}
        image_files = []
        
        for ext in image_extensions:
            image_files.extend(self.source_dir.rglob(f'*{ext}'))
            image_files.extend(self.source_dir.rglob(f'*{ext.upper()}'))
        
        logger.info(f"Found {len(image_files)} image files")
        
        # Organize files
        organized_count = 0
        for image_file in image_files:
            filename = image_file.name.lower()
            
            for class_name, patterns in filename_patterns.items():
                if any(pattern.lower() in filename for pattern in patterns):
                    dest_path = self.output_dir / class_name / image_file.name
                    shutil.copy2(image_file, dest_path)
                    organized_count += 1
                    logger.info(f"Organized: {image_file.name} -> {class_name}")
                    break
        
        logger.info(f"Organized {organized_count} images")
    
    def organize_by_directory(self, directory_mapping: Dict[str, str]):
        """
        Organize images based on source directory names
        
        Args:
            directory_mapping (Dict): Dictionary mapping source dir names to class names
        """
        logger.info("Organizing images by directory structure...")
        
        organized_count = 0
        
        for source_dir_name, class_name in directory_mapping.items():
            source_path = self.source_dir / source_dir_name
            
            if not source_path.exists():
                logger.warning(f"Source directory not found: {source_path}")
                continue
            
            # Get all image files in the source directory
            image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif'}
            image_files = []
            
            for ext in image_extensions:
                image_files.extend(source_path.rglob(f'*{ext}'))
                image_files.extend(source_path.rglob(f'*{ext.upper()}'))
            
            # Copy files to organized structure
            for image_file in image_files:
                dest_path = self.output_dir / class_name / image_file.name
                shutil.copy2(image_file, dest_path)
                organized_count += 1
            
            logger.info(f"Organized {len(image_files)} images from {source_dir_name} -> {class_name}")
        
        logger.info(f"Total organized images: {organized_count}")
    
    def create_train_val_split(self, val_split: float = 0.2, random_seed: int = 42):
        """
        Create train/validation split from organized dataset
        
        Args:
            val_split (float): Fraction of data to use for validation
            random_seed (int): Random seed for reproducibility
        """
        logger.info(f"Creating train/validation split (validation: {val_split})...")
        
        random.seed(random_seed)
        
        # Create train and val directories
        train_dir = self.output_dir / 'train'
        val_dir = self.output_dir / 'val'
        
        for split_dir in [train_dir, val_dir]:
            for class_name in self.classes:
                (split_dir / class_name).mkdir(parents=True, exist_ok=True)
        
        # Split each class
        for class_name in self.classes:
            class_dir = self.output_dir / class_name
            if not class_dir.exists():
                logger.warning(f"Class directory not found: {class_dir}")
                continue
            
            # Get all images in the class
            image_files = list(class_dir.glob('*'))
            random.shuffle(image_files)
            
            # Calculate split
            val_count = int(len(image_files) * val_split)
            train_files = image_files[val_count:]
            val_files = image_files[:val_count]
            
            # Move files to train directory
            for image_file in train_files:
                dest_path = train_dir / class_name / image_file.name
                shutil.move(str(image_file), str(dest_path))
            
            # Move files to validation directory
            for image_file in val_files:
                dest_path = val_dir / class_name / image_file.name
                shutil.move(str(image_file), str(dest_path))
            
            logger.info(f"{class_name}: {len(train_files)} train, {len(val_files)} validation")
        
        # Remove empty class directories
        for class_name in self.classes:
            class_dir = self.output_dir / class_name
            if class_dir.exists() and not any(class_dir.iterdir()):
                class_dir.rmdir()
        
        logger.info("Train/validation split completed!")
    
    def validate_images(self, min_size: Tuple[int, int] = (100, 100)):
        """
        Validate and clean images
        
        Args:
            min_size (Tuple): Minimum image dimensions
        """
        logger.info("Validating images...")
        
        valid_count = 0
        invalid_count = 0
        
        for class_name in self.classes:
            class_dir = self.output_dir / class_name
            if not class_dir.exists():
                continue
            
            for image_file in class_dir.glob('*'):
                try:
                    # Try to open image
                    with Image.open(image_file) as img:
                        # Check if image is valid
                        img.verify()
                    
                    # Check dimensions
                    with Image.open(image_file) as img:
                        if img.size[0] < min_size[0] or img.size[1] < min_size[1]:
                            logger.warning(f"Image too small: {image_file} ({img.size})")
                            image_file.unlink()
                            invalid_count += 1
                        else:
                            valid_count += 1
                            
                except Exception as e:
                    logger.warning(f"Invalid image: {image_file} - {e}")
                    image_file.unlink()
                    invalid_count += 1
        
        logger.info(f"Validation complete: {valid_count} valid, {invalid_count} invalid images")
    
    def get_dataset_stats(self) -> Dict:
        """Get statistics about the dataset"""
        stats = {}
        
        for class_name in self.classes:
            class_dir = self.output_dir / class_name
            if class_dir.exists():
                image_count = len(list(class_dir.glob('*')))
                stats[class_name] = image_count
            else:
                stats[class_name] = 0
        
        # Check for train/val split
        train_dir = self.output_dir / 'train'
        val_dir = self.output_dir / 'val'
        
        if train_dir.exists() and val_dir.exists():
            stats['train'] = {}
            stats['validation'] = {}
            
            for class_name in self.classes:
                train_count = len(list((train_dir / class_name).glob('*')))
                val_count = len(list((val_dir / class_name).glob('*')))
                stats['train'][class_name] = train_count
                stats['validation'][class_name] = val_count
        
        return stats
    
    def print_dataset_stats(self):
        """Print dataset statistics"""
        stats = self.get_dataset_stats()
        
        logger.info("Dataset Statistics:")
        logger.info("=" * 50)
        
        if 'train' in stats:
            logger.info("Train Set:")
            for class_name, count in stats['train'].items():
                logger.info(f"  {class_name}: {count}")
            
            logger.info("\nValidation Set:")
            for class_name, count in stats['validation'].items():
                logger.info(f"  {class_name}: {count}")
        else:
            logger.info("Organized Dataset:")
            for class_name, count in stats.items():
                logger.info(f"  {class_name}: {count}")
        
        total_images = sum(stats.get('train', stats).values())
        logger.info(f"\nTotal Images: {total_images}")

def download_sample_dataset():
    """Download and prepare a sample dataset"""
    logger.info("This function would download a sample dataset.")
    logger.info("For now, please manually organize your dataset.")
    logger.info("Expected structure:")
    logger.info("dataset/")
    logger.info("  ├── Normal/")
    logger.info("  ├── Cataract/")
    logger.info("  ├── Glaucoma/")
    logger.info("  └── DiabeticRetinopathy/")

def main():
    """Main function for dataset preparation"""
    # Example usage
    source_dir = "raw_images"  # Change this to your source directory
    output_dir = "dataset"
    
    if not os.path.exists(source_dir):
        logger.error(f"Source directory not found: {source_dir}")
        logger.info("Please create the source directory and add your images.")
        return
    
    # Create dataset preparator
    preparator = DatasetPreparator(source_dir, output_dir)
    
    # Example: Organize by filename patterns
    filename_patterns = {
        'Normal': ['normal', 'healthy', 'control'],
        'Cataract': ['cataract', 'cat'],
        'Glaucoma': ['glaucoma', 'glau'],
        'DiabeticRetinopathy': ['diabetic', 'dr', 'retinopathy']
    }
    
    # Organize images
    preparator.organize_by_filename(filename_patterns)
    
    # Validate images
    preparator.validate_images()
    
    # Create train/validation split
    preparator.create_train_val_split(val_split=0.2)
    
    # Print statistics
    preparator.print_dataset_stats()
    
    logger.info("Dataset preparation completed!")

if __name__ == "__main__":
    main() 