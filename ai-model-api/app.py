import os
from typing import Annotated, Dict, Any

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from utils import validate_image, load_image_rgb, center_square_crop, to_tensor
from model import EyeModel as RealEyeModel

# ---------- Config ----------
MODEL_WEIGHTS = os.getenv("MODEL_WEIGHTS", "weights/model.pt")
LABELS_PATH   = os.getenv("LABELS_PATH", "labels.json")
INPUT_SIZE    = int(os.getenv("INPUT_SIZE", 224))
TOPK          = int(os.getenv("TOPK", 3))
# Use port 8001 for AI Model API to avoid conflict with backend
PORT          = int(os.getenv("PORT", 8001))

# ---------- App ----------
app = FastAPI(
    title="EyeCare AI Model API",
    version="1.0.0",
    description="Image classification API for retinal/eye disease screening (educational use only)."
)

# CORS (adjust to match your frontend/backend origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # lock down in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy-load model on first request (fast cold start with small models)
_model = None

def get_model():
	global _model
	if _model is None:
		weights_missing = not os.path.exists(MODEL_WEIGHTS)
		if weights_missing:
			raise RuntimeError(f"Model weights not found at {MODEL_WEIGHTS}. Set MODEL_WEIGHTS env or place weights file.")
		try:
			_model = RealEyeModel(
				weights_path=MODEL_WEIGHTS,
				labels_path=LABELS_PATH,
				input_size=INPUT_SIZE,
				arch=os.getenv("MODEL_ARCH")
			)
		except Exception as e:
			raise RuntimeError(f"Failed to load real model: {e}")
	return _model

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/labels")
def labels():
    m = get_model()
    return {str(k): v for k, v in m.labels.items()}

@app.post("/predict")
async def predict(image: Annotated[UploadFile, File(description="Eye/retina image (JPG/PNG/WebP)")]):
    try:
        raw = await image.read()
        validate_image(raw, image.content_type)
        pil = load_image_rgb(raw)
        pil = center_square_crop(pil)

        m = get_model()
        tensor = to_tensor(pil, size=INPUT_SIZE)
        idx, conf, top = m.predict(tensor, topk=TOPK)

        # Build probabilities map
        top_probs = [
            {"index": i, "label": m.idx_to_label(i), "confidence": round(c * 100, 2)}
            for i, c in top
        ]

        result = {
            "best": {
                "index": idx,
                "label": m.idx_to_label(idx),
                "confidence": round(conf * 100, 2)
            },
            "topk": top_probs,
            "advice": (
                "This is not a diagnosis. Please consult a licensed ophthalmologist, "
                "especially if you experience symptoms or vision changes."
            )
        }
        return JSONResponse(result)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except RuntimeError as re:
        raise HTTPException(status_code=500, detail=str(re))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
