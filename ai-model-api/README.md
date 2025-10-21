# EyeCare AI Model API

A production-ready FastAPI + PyTorch API for retinal/eye disease screening using AI models.

⚠️ **Important**: This API is for educational/screening purposes only, not medical diagnosis. Always advise users to consult licensed ophthalmologists.

## Features

- 🚀 FastAPI with async image processing
- 🧠 PyTorch model inference (ResNet50, EfficientNet, etc.)
- 🖼️ Robust image validation and preprocessing
- 📊 Top-k predictions with confidence scores
- 🐳 Docker support for easy deployment
- 🔒 CORS enabled for frontend integration

## Quick Start

### 1. Setup Environment

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Add Your Model

Place your trained PyTorch model weights in `weights/model.pt`:

```bash
# Example: Copy your trained model
cp /path/to/your/model.pt weights/model.pt
```

### 3. Update Labels

Edit `labels.json` to match your model's classes:

```json
{
  "0": "No DR",
  "1": "Mild DR", 
  "2": "Moderate DR",
  "3": "Severe DR",
  "4": "Proliferative DR"
}
```

### 4. Run the API

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### Health Check
```bash
GET /health
# Returns: {"status": "ok"}
```

### Get Labels
```bash
GET /labels
# Returns: {"0": "No DR", "1": "Mild DR", ...}
```

### Predict Image
```bash
POST /predict
# Form data: image file (JPG/PNG/WebP)
# Returns: prediction with confidence scores
```

## Testing

### cURL Example
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/path/to/your/test.jpg"
```

### Python Example
```python
import requests

with open('test_image.jpg', 'rb') as f:
    files = {'image': f}
    response = requests.post('http://localhost:8000/predict', files=files)
    print(response.json())
```

## Docker Deployment

### Build Image
```bash
docker build -t eye-ai-api .
```

### Run Container
```bash
docker run -p 8000:8000 -v $(pwd)/weights:/app/weights eye-ai-api
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MODEL_WEIGHTS` | `weights/model.pt` | Path to model weights |
| `LABELS_PATH` | `labels.json` | Path to labels file |
| `INPUT_SIZE` | `224` | Model input size |
| `TOPK` | `3` | Number of top predictions |

## Model Training

### Quick Recipe (PyTorch)

1. **Dataset**: Use EyePACS (DR) or OCT2017 (4-class)
2. **Architecture**: Start with ResNet50/EfficientNet pretrained on ImageNet
3. **Training**:
   ```python
   # Replace final layer
   model.fc = nn.Linear(model.fc.in_features, num_classes)
   
   # Train with CrossEntropy loss, AdamW optimizer
   # Export: torch.save(model.state_dict(), "weights/model.pt")
   ```

4. **Keep label order consistent** with `labels.json`

## Integration with Node.js Backend

Update your Node.js backend to forward images to this API:

```javascript
// .env
AI_MODEL_API=http://localhost:8000/predict

// scanRoutes.js
router.post("/", upload.single("image"), async (req, res) => {
  const form = new FormData();
  form.append("image", fs.createReadStream(req.file.path));
  
  const { data } = await axios.post(process.env.AI_MODEL_API, form, {
    headers: form.getHeaders(),
  });
  
  res.json({
    condition: data.best.label,
    confidence: data.best.confidence,
    probabilities: data.topk,
    advice: data.advice,
  });
});
```

## Production Considerations

- 🔒 Lock down CORS origins
- 🚀 Use production WSGI server (Gunicorn + Uvicorn)
- 📊 Add monitoring and logging
- 🔐 Implement rate limiting
- 🏥 Add medical disclaimer endpoints
- 📈 Model versioning and A/B testing

## Troubleshooting

### Common Issues

1. **Model not found**: Ensure `weights/model.pt` exists
2. **CUDA errors**: Model will fallback to CPU automatically
3. **Memory issues**: Reduce `INPUT_SIZE` or use smaller model
4. **Import errors**: Check Python version compatibility

### Performance Tips

- Use GPU if available (CUDA)
- Optimize input size for your use case
- Consider model quantization for production
- Implement request caching for repeated images

## License

This project is for educational purposes. Ensure compliance with medical device regulations in your jurisdiction.
