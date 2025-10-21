import io
from typing import Tuple
from PIL import Image, UnidentifiedImageError
import numpy as np
import cv2

ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp"}

def validate_image(file_bytes: bytes, content_type: str, max_mb: int = 10) -> None:
    if content_type not in ALLOWED_MIME:
        raise ValueError("Unsupported file type. Use JPG/PNG/WebP.")
    if len(file_bytes) > max_mb * 1024 * 1024:
        raise ValueError(f"File too large. Max {max_mb} MB.")
    try:
        Image.open(io.BytesIO(file_bytes)).verify()
    except UnidentifiedImageError:
        raise ValueError("Corrupted or unreadable image file.")

def load_image_rgb(file_bytes: bytes) -> Image.Image:
    # Return RGB PIL Image (FastAPI gives us bytes)
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    return img

def center_square_crop(img: Image.Image) -> Image.Image:
    w, h = img.size
    s = min(w, h)
    left = (w - s) // 2
    top = (h - s) // 2
    return img.crop((left, top, left + s, top + s))

def to_tensor(img: Image.Image, size: int = 224) -> "torch.Tensor":
    import torch
    import torchvision.transforms as T

    tfm = T.Compose([
        T.Resize((size, size)),
        T.ToTensor(),
        # Imagenet normalization (or replace with your dataset stats)
        T.Normalize(mean=[0.485, 0.456, 0.406],
                    std=[0.229, 0.224, 0.225]),
    ])
    return tfm(img).unsqueeze(0)  # shape: (1, 3, H, W)

def heatmap_overlay(orig: Image.Image, mask: np.ndarray, alpha: float = 0.35) -> Image.Image:
    """Optional: overlay a saliency/heatmap for explainability (mask in [0,1])."""
    orig_bgr = cv2.cvtColor(np.array(orig), cv2.COLOR_RGB2BGR)
    heat = (mask * 255).astype(np.uint8)
    heat = cv2.applyColorMap(heat, cv2.COLORMAP_JET)
    heat = cv2.resize(heat, (orig_bgr.shape[1], orig_bgr.shape[0]))
    overlay = cv2.addWeighted(heat, alpha, orig_bgr, 1 - alpha, 0)
    return Image.fromarray(cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB))
