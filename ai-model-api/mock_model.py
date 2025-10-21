"""
Mock model for testing the API without real PyTorch weights.
Replace this with your actual trained model.
"""

import json
import random
from typing import Dict, List, Tuple

class MockEyeModel:
    def __init__(self,
                 weights_path: str = "weights/model.pt",
                 labels_path: str = "labels.json",
                 input_size: int = 224,
                 device: str | None = None):
        self.device = "cpu"  # Mock device
        self.input_size = input_size
        self.labels = self._load_labels(labels_path)
        self.num_classes = len(self.labels)
        
        print(f"🤖 Mock model loaded with {self.num_classes} classes")
        print(f"   Labels: {list(self.labels.values())}")

    @staticmethod
    def _load_labels(p: str) -> Dict[int, str]:
        try:
            with open(p, "r", encoding="utf-8") as f:
                d = json.load(f)
            return {int(k): v for k, v in d.items()}
        except FileNotFoundError:
            # Fallback labels if file doesn't exist
            return {
                0: "No DR",
                1: "Mild DR", 
                2: "Moderate DR",
                3: "Severe DR",
                4: "Proliferative DR"
            }

    def predict(self, tensor, topk: int = 3) -> Tuple[int, float, List[Tuple[int, float]]]:
        """
        Mock prediction - returns random results for testing
        """
        # Generate random probabilities that sum to 1
        probs = [random.random() for _ in range(self.num_classes)]
        total = sum(probs)
        probs = [p/total for p in probs]
        
        # Find best prediction
        best_idx = probs.index(max(probs))
        best_conf = probs[best_idx]
        
        # Get top-k predictions
        k = min(topk, self.num_classes)
        sorted_probs = sorted(enumerate(probs), key=lambda x: x[1], reverse=True)
        top = [(int(i), float(c)) for i, c in sorted_probs[:k]]
        
        return int(best_idx), float(best_conf), top

    def idx_to_label(self, idx: int) -> str:
        return self.labels.get(idx, f"Unknown Class {idx}")

# For testing without real weights
if __name__ == "__main__":
    model = MockEyeModel()
    print(f"Model initialized with {model.num_classes} classes")
    print(f"Sample prediction: {model.predict(None)}")
