# 🚀 Quick Start Guide

Get your Eye Problem Detection Backend running in minutes!

## Prerequisites

- Node.js (v16 or higher)
- Python 3.8 or higher
- MongoDB (local or cloud)

## ⚡ Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
# Run the setup script
./setup.sh
```

### Option 2: Manual Setup
```bash
# 1. Install Node.js dependencies
npm install

# 2. Install Python dependencies
pip3 install -r requirements.txt

# 3. Create environment file
cp env.example .env

# 4. Edit .env with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/eye-detection
```

## 🎯 Start the Backend

```bash
# Start development server
npm run dev
```

The server will start on `http://localhost:5000`

## 🧪 Test the Backend

```bash
# Run the test script
node test-backend.js
```

## 🔗 API Endpoints

Once running, you can test these endpoints:

- **Health Check**: `GET http://localhost:5000/health`
- **Upload Image**: `POST http://localhost:5000/api/upload`
- **Get Doctors**: `GET http://localhost:5000/api/doctors/city/mumbai`
- **Get Suggestions**: `GET http://localhost:5000/api/suggestions/Diabetic%20Retinopathy`

## 🐍 Python AI Model (Optional)

If you want to use the real AI model instead of mock responses:

```bash
# Start the Python AI model
python3 ai_model_sample.py

# Then set in your .env file:
USE_REAL_AI=true
AI_MODEL_URL=http://localhost:8000
```

## 🔧 Environment Configuration

Edit `.env` file with your settings:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/eye-detection

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# AI Model (optional)
AI_MODEL_URL=http://localhost:8000
USE_REAL_AI=false
```

## 🚨 Troubleshooting

### Python Dependencies Issues
If you encounter Python dependency issues:

```bash
# Try the minimal requirements
pip3 install -r requirements-minimal.txt

# Then install additional packages
pip3 install opencv-python Pillow gunicorn
```

### MongoDB Connection Issues
- Make sure MongoDB is running
- Check your MongoDB URI in `.env`
- For local MongoDB: `mongod`

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

## 📚 Next Steps

1. **Connect Frontend**: Update your frontend to use `http://localhost:5000` as the API base URL
2. **Add Real AI Model**: Replace the mock AI responses with your trained model
3. **Deploy**: Use the deployment guide for production setup
4. **Customize**: Modify the models and controllers for your specific needs

## 🆘 Need Help?

- Check the full [README.md](README.md)
- Review [API Documentation](API_DOCUMENTATION.md)
- See [Deployment Guide](DEPLOYMENT.md)
- Run `node test-backend.js` to verify everything works

---

**🎉 You're all set! Your backend is ready to power your Eye Problem Detection Website.** 