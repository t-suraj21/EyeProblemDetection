# Eye Problem Detection Backend

A comprehensive Node.js backend for AI-powered eye problem detection using retina images.

## 🚀 Features

- **AI Integration**: Connects with Python AI model for retina image analysis
- **Image Upload**: Secure file upload with validation and processing
- **Database Management**: MongoDB with Mongoose ODM
- **Doctor Management**: Find and manage ophthalmologists
- **Medicine Suggestions**: AI-powered treatment recommendations
- **Security**: Rate limiting, CORS, helmet, and input validation
- **Scalable Architecture**: Modular design with controllers, services, and routes

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **File Upload**: Multer
- **AI Communication**: Axios
- **Security**: Helmet, CORS, Rate Limiting
- **Authentication**: JWT (ready for implementation)

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── uploadController.js   # Image upload & AI processing
│   ├── resultController.js   # Scan results & suggestions
│   └── doctorController.js   # Doctor management
├── models/
│   ├── Scan.js              # Retina scan data model
│   ├── Doctor.js            # Doctor information model
│   └── User.js              # User model (for future auth)
├── routes/
│   ├── uploadRoutes.js      # Upload endpoints
│   ├── resultRoutes.js      # Results endpoints
│   └── doctorRoutes.js      # Doctor endpoints
├── middleware/
│   └── uploadMiddleware.js  # Multer configuration
├── services/
│   └── aiService.js         # AI model communication
├── uploads/                 # Uploaded images
├── server.js               # Main application file
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Python AI model (optional for development)

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB** (if using local)
   ```bash
   mongod
   ```

5. **Run the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Upload Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload retina image for AI analysis |
| GET | `/api/upload/stats` | Get upload statistics |

### Result Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/result/:id` | Get scan result by ID |
| GET | `/api/result/suggestions/:issue` | Get medicine/tips for problem |
| GET | `/api/result/user/:userId` | Get user's scan history |
| GET | `/api/result/stats/overview` | Get scan statistics |

### Doctor Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors/city/:city` | Get doctors by city |
| GET | `/api/doctors` | Get all doctors with filters |
| GET | `/api/doctors/id/:id` | Get doctor by ID |
| POST | `/api/doctors/add` | Add new doctor (Admin) |
| PUT | `/api/doctors/:id/rating` | Update doctor rating |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

## 🔧 Configuration

### Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/eye-detection

# Frontend
FRONTEND_URL=http://localhost:3000

# AI Model
AI_MODEL_URL=http://localhost:8000
USE_REAL_AI=false

# Security
JWT_SECRET=your-secret-key
```

### AI Model Integration

The backend connects to a Python AI model via HTTP. For development, it uses mock responses.

**Python AI Model Expected Response:**
```json
{
  "problem": "Diabetic Retinopathy",
  "confidenceScore": 87.5,
  "cause": "Long-term diabetes affecting blood vessels",
  "severity": "Moderate",
  "suggestions": ["Regular checkups", "Control blood sugar"]
}
```

## 📊 Database Models

### Scan Model
```javascript
{
  userId: String,
  imageUrl: String,
  detectedProblem: String,
  confidenceScore: Number,
  cause: String,
  severity: String,
  suggestions: [String],
  createdAt: Date
}
```

### Doctor Model
```javascript
{
  name: String,
  specialization: String,
  hospital: String,
  city: String,
  type: String, // "government" | "private"
  contact: String,
  address: String,
  experience: Number,
  rating: Number,
  isActive: Boolean
}
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable origins
- **Helmet**: Security headers
- **Input Validation**: File type and size validation
- **Error Handling**: Comprehensive error management

## 🧪 Testing

### Manual Testing

1. **Health Check**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Upload Image**
   ```bash
   curl -X POST -F "image=@retina.jpg" http://localhost:5000/api/upload
   ```

3. **Get Doctors**
   ```bash
   curl http://localhost:5000/api/doctors/city/mumbai
   ```

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   AI_MODEL_URL=your-production-ai-url
   ```

2. **Process Manager** (PM2)
   ```bash
   npm install -g pm2
   pm2 start server.js --name "eye-detection-api"
   ```

3. **Reverse Proxy** (Nginx)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the health check endpoint

---

**Note**: This backend is designed to work with the Eye Problem Detection frontend. Make sure both are properly configured and running. 