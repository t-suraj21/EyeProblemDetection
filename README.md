# 👁️ EyeCare AI - Eye Disease Detection System

A full-stack AI-powered application for detecting eye diseases from retinal images using deep learning. This system can identify **Cataract**, **Diabetic Retinopathy**, **Glaucoma**, and **Normal** eye conditions with confidence scores.

> ⚠️ **Medical Disclaimer**: This application is for educational and screening purposes only. It is NOT a substitute for professional medical diagnosis. Always consult a licensed ophthalmologist for proper medical evaluation.

## 🌟 Features

- 🧠 **AI-Powered Detection**: Uses PyTorch-based deep learning model (ResNet50/EfficientNet) for accurate eye disease classification
- 📸 **Image Upload & Analysis**: Upload retinal images for instant AI analysis
- 📊 **Confidence Scores**: Get top-k predictions with confidence percentages
- 👨‍⚕️ **Doctor Directory**: Browse and search for eye care specialists
- 💊 **Medicine Suggestions**: Get medicine recommendations based on detected conditions
- 📱 **Responsive Design**: Modern, mobile-friendly UI built with React and Tailwind CSS
- 🔄 **Real-time Processing**: Async image processing for fast results
- 📄 **PDF Export**: Download scan results as PDF reports
- 🗄️ **Database Integration**: MongoDB for storing doctors, medicines, and scan history

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   React Frontend │ ────▶│  Node.js Backend │ ────▶│  AI Model API   │
│   (Port 5173)   │ ◀────│   (Port 8000)    │ ◀────│   (Port 8001)   │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                   │
                                   ▼
                         ┌──────────────────┐
                         │  MongoDB Database │
                         └──────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons
- **jsPDF & html2canvas** - PDF generation

### Backend
- **Node.js & Express** - REST API server
- **MongoDB & Mongoose** - Database
- **Multer** - File upload handling
- **Axios** - HTTP client for AI API
- **CORS** - Cross-origin resource sharing

### AI Model API
- **FastAPI** - High-performance Python API
- **PyTorch** - Deep learning framework
- **Pillow (PIL)** - Image processing
- **Uvicorn** - ASGI server

## 📁 Project Structure

```
EYE-problem detection/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/        # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── ScanEye.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/              # Node.js Express backend
│   ├── models/          # Mongoose schemas
│   │   ├── Doctor.js
│   │   └── Medicine.js
│   ├── routes/          # API routes
│   │   ├── scanRoutes.js
│   │   ├── doctorRoutes.js
│   │   └── medicineRoutes.js
│   ├── uploads/         # Uploaded images storage
│   ├── index.js         # Main server file
│   └── package.json
│
└── ai-model-api/        # Python FastAPI for AI inference
    ├── dataset/         # Training dataset
    │   ├── cataract/
    │   ├── diabetic_retinopathy/
    │   ├── glaucoma/
    │   └── normal/
    ├── weights/         # Model weights
    │   └── model.pt
    ├── app.py          # FastAPI application
    ├── model.py        # PyTorch model loader
    ├── train.py        # Model training script
    ├── utils.py        # Image preprocessing utilities
    ├── labels.json     # Class labels
    └── requirements.txt
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local or Atlas)
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/EYE-problem-detection.git
cd EYE-problem-detection
```

#### 2. Setup AI Model API (Python)

```bash
cd ai-model-api

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the AI API server
uvicorn app:app --host 0.0.0.0 --port 8001 --reload
```

The AI API will be available at `http://localhost:8001`

**API Endpoints:**
- `GET /health` - Health check
- `GET /labels` - Get disease labels
- `POST /predict` - Upload image for prediction

#### 3. Setup Backend (Node.js)

```bash
cd ../backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your configuration:
# MONGODB_URI=mongodb://localhost:27017/eye-care-app
# PORT=8000
# AI_MODEL_API=http://localhost:8001/predict
# NODE_ENV=development

# Start the backend server
npm run dev
```

The backend will be available at `http://localhost:8000`

**API Endpoints:**
- `GET /health` - Health check
- `POST /api/scan` - Upload and scan eye image
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/search?q=query` - Search doctors
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/condition/:condition` - Get medicines by condition

#### 4. Setup Frontend (React)

```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🎯 Usage

### For End Users

1. **Open the application** in your browser at `http://localhost:5173`
2. **Navigate to "Scan Eye"** page
3. **Upload a retinal image** (JPG, PNG, or WebP format)
4. **View the AI analysis** with:
   - Predicted condition
   - Confidence percentage
   - Top predictions
   - Medical advice
5. **Download the report** as PDF
6. **Browse doctors** and **medicines** for treatment options

### For Developers

#### Training Your Own Model

```bash
cd ai-model-api

# Prepare your dataset in the dataset/ folder
# Structure: dataset/<class_name>/<images>

# Run training
python train.py

# The trained model will be saved to weights/model.pt
```

#### Testing the API

```bash
# Test AI Model API
curl -X POST "http://localhost:8001/predict" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@test_image.jpg"

# Test Backend API
curl http://localhost:8000/health

# Test with frontend
# Navigate to http://localhost:5173 and use the UI
```

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/eye-care-app

# AI Model API
AI_MODEL_API=http://localhost:8001/predict

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

### AI Model API

```env
# Model Configuration
MODEL_WEIGHTS=weights/model.pt
LABELS_PATH=labels.json
INPUT_SIZE=224
TOPK=3
PORT=8001

# Optional: Model Architecture
MODEL_ARCH=resnet50  # or efficientnet_b0, etc.
```

## 📊 Dataset

The model is trained on a dataset containing four categories:

- **Cataract** (1,038 images)
- **Diabetic Retinopathy** (1,098 images)
- **Glaucoma** (1,007 images)
- **Normal** (1,074 images)

**Total Training Images:** ~4,217 retinal images

## 🔬 Model Details

- **Architecture:** ResNet50 (pre-trained on ImageNet)
- **Input Size:** 224×224 pixels
- **Output Classes:** 4 (Cataract, Diabetic Retinopathy, Glaucoma, Normal)
- **Training:** Transfer learning with fine-tuning
- **Confidence Threshold:** Results show top-3 predictions with percentages

## 📸 Screenshots

### Home Page
Modern landing page with hero section and call-to-action

### Scan Eye Page
Upload retinal images for AI analysis

### Results Page
View detailed analysis with confidence scores and recommendations

### Doctor Directory
Browse and search for eye care specialists

## 🐳 Docker Deployment (Optional)

### AI Model API

```bash
cd ai-model-api
docker build -t eye-ai-api .
docker run -p 8001:8001 -v $(pwd)/weights:/app/weights eye-ai-api
```

### Full Stack Deployment

Create a `docker-compose.yml` for all services:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  ai-api:
    build: ./ai-model-api
    ports:
      - "8001:8001"
    volumes:
      - ./ai-model-api/weights:/app/weights

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/eye-care-app
      - AI_MODEL_API=http://ai-api:8001/predict
    depends_on:
      - mongodb
      - ai-api

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

Run with:
```bash
docker-compose up -d
```

## 🧪 Testing

### Run Frontend Tests
```bash
cd frontend
npm run test
```

### Run Backend Tests
```bash
cd backend
npm run test
```

## 🚀 Production Build

### Frontend
```bash
cd frontend
npm run build
# Build output will be in dist/ folder
```

### Deploy to Production
- Use **Vercel** or **Netlify** for frontend
- Use **Railway**, **Heroku**, or **DigitalOcean** for backend
- Use **AWS EC2** or **Google Cloud** for AI Model API
- Use **MongoDB Atlas** for database

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint rules for JavaScript/React code
- Follow PEP 8 style guide for Python code
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## 📝 License

This project is for **educational purposes only**. 

### Important Notes:
- This is NOT a medical device and should not be used for clinical diagnosis
- The model predictions are for screening and educational purposes only
- Always consult qualified healthcare professionals for medical advice
- Ensure compliance with medical device regulations in your jurisdiction

## 🙏 Acknowledgments

- **PyTorch** team for the deep learning framework
- **FastAPI** for the high-performance Python API framework
- **React** and **Vite** teams for the modern frontend tools
- Medical imaging datasets contributors
- Open-source community

## 📧 Contact

For questions, issues, or collaboration:

- **GitHub Issues:** [Create an issue](https://github.com/yourusername/EYE-problem-detection/issues)
- **Email:** your.email@example.com

## 🔄 Roadmap

- [ ] Add more eye disease categories
- [ ] Implement user authentication
- [ ] Add scan history and tracking
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Integration with telemedicine platforms
- [ ] Advanced analytics dashboard
- [ ] Real-time video stream analysis
- [ ] Batch processing for multiple images
- [ ] Model performance metrics tracking

## 📚 Resources

- [PyTorch Documentation](https://pytorch.org/docs/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Eye Disease Information](https://www.nei.nih.gov/)

---

**Made with ❤️ for better eye health screening**

⭐ Star this repo if you found it helpful!

