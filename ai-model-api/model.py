import os
import json
from pathlib import Path
from typing import Dict, List, Tuple

import torch
import torch.nn.functional as F
from torchvision import models


def build_model_for_inference(arch: str, num_classes: int) -> torch.nn.Module:
    arch = (arch or "resnet50").lower()
    if arch in ["resnet50", "resnet"]:
        model = models.resnet50(weights=None)
        in_features = model.fc.in_features
        model.fc = torch.nn.Linear(in_features, num_classes)
        return model
    elif arch in ["efficientnet_b0", "efficientnet"]:
        model = models.efficientnet_b0(weights=None)
        in_features = model.classifier[-1].in_features
        model.classifier[-1] = torch.nn.Linear(in_features, num_classes)
        return model
    else:
        raise ValueError(f"Unsupported MODEL_ARCH for inference: {arch}")


class EyeModel:
    def __init__(self,
                 weights_path: str = "weights/model.pt",
                 labels_path: str = "labels.json",
                 input_size: int = 224,
                 device: str | None = None,
                 arch: str | None = None):
        self.device = torch.device(device or ("cuda" if torch.cuda.is_available() else "cpu"))
        self.input_size = input_size
        self.labels = self._load_labels(labels_path)
        self.num_classes = len(self.labels)

        model_arch = arch or os.getenv("MODEL_ARCH", "resnet50")
        self.model = build_model_for_inference(model_arch, self.num_classes)
        state = torch.load(weights_path, map_location="cpu")
        self.model.load_state_dict(state, strict=True)
        self.model.eval().to(self.device)

    @staticmethod
    def _load_labels(p: str) -> Dict[int, str]:
        with open(p, "r", encoding="utf-8") as f:
            d = json.load(f)
        # Ensure keys are ints
        return {int(k): v for k, v in d.items()}

    @torch.inference_mode()
    def predict(self, tensor: "torch.Tensor", topk: int = 3) -> Tuple[int, float, List[Tuple[int, float]]]:
        """
        tensor: shape (1,3,H,W), already normalized
        returns: (best_idx, best_conf, topk_list[(idx, conf)])
        """
        tensor = tensor.to(self.device, non_blocking=True)
        logits = self.model(tensor)
        probs = F.softmax(logits, dim=1).squeeze(0)  # (C,)
        best_conf, best_idx = torch.max(probs, dim=0)
        k = min(topk, self.num_classes)
        top_conf, top_idx = torch.topk(probs, k=k)
        top = [(int(i), float(c)) for i, c in zip(top_idx.tolist(), top_conf.tolist())]
        return int(best_idx), float(best_conf), top

    def idx_to_label(self, idx: int) -> str:
        return self.labels[idx]
