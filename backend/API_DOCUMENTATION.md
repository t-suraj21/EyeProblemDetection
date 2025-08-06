# Eye Problem Detection Backend API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
Currently, the API doesn't require authentication. User identification is handled via `userId` parameter (optional).

## Response Format
All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": { ... },
  "error": "Error message (if any)"
}
```

---

## 📤 Upload Endpoints

### Upload Retina Image
**POST** `/api/upload`

Upload a retina image for AI analysis.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with `image` field containing the image file

**Parameters:**
- `image` (required): Image file (JPEG, PNG, GIF, BMP, TIFF)
- `userId` (optional): User identifier

**Response:**
```json
{
  "success": true,
  "message": "Retina scan completed successfully",
  "data": {
    "scanId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "problem": "Diabetic Retinopathy",
    "confidenceScore": 87.5,
    "severity": "Moderate",
    "timestamp": "2023-09-06T10:30:00.000Z"
  }
}
```

**Example:**
```bash
curl -X POST -F "image=@retina.jpg" -F "userId=user123" http://localhost:5000/api/upload
```

### Get Upload Statistics
**GET** `/api/upload/stats`

Get upload statistics and analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalScans": 150,
    "todayScans": 12,
    "problemStats": [
      {
        "_id": "Diabetic Retinopathy",
        "count": 45
      },
      {
        "_id": "Glaucoma",
        "count": 32
      }
    ]
  }
}
```

---

## 📊 Result Endpoints

### Get Scan Result
**GET** `/api/result/:id`

Get detailed scan result by scan ID.

**Parameters:**
- `id` (required): Scan ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "userId": "user123",
    "imageUrl": "./uploads/retina-1234567890.jpg",
    "detectedProblem": "Diabetic Retinopathy",
    "confidenceScore": 87.5,
    "cause": "Long-term diabetes affecting blood vessels in the retina",
    "severity": "Moderate",
    "suggestions": [
      "Schedule regular eye checkups",
      "Control blood sugar levels"
    ],
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

### Get Suggestions
**GET** `/api/result/suggestions/:issue`

Get medicine suggestions and care tips for a specific eye problem.

**Parameters:**
- `issue` (required): Eye problem name (URL encoded)
- `type` (optional): `medicines`, `tips`, or `all` (default: `all`)

**Response:**
```json
{
  "success": true,
  "data": {
    "medicines": [
      "Anti-VEGF injections (Lucentis, Avastin)",
      "Corticosteroid implants",
      "Laser photocoagulation treatment"
    ],
    "careTips": [
      "Control blood sugar levels",
      "Monitor blood pressure",
      "Regular eye examinations"
    ]
  }
}
```

**Example:**
```bash
curl "http://localhost:5000/api/result/suggestions/Diabetic%20Retinopathy?type=medicines"
```

### Get User Scans
**GET** `/api/result/user/:userId`

Get scan history for a specific user.

**Parameters:**
- `userId` (required): User identifier
- `limit` (optional): Number of results (default: 10)
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "success": true,
  "data": {
    "scans": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "detectedProblem": "Diabetic Retinopathy",
        "confidenceScore": 87.5,
        "severity": "Moderate",
        "createdAt": "2023-09-06T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalScans": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Get Scan Statistics
**GET** `/api/result/stats/overview`

Get comprehensive scan statistics.

**Parameters:**
- `period` (optional): `week`, `month`, or `all` (default: `all`)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalScans": 150,
    "severityStats": [
      {
        "_id": "Moderate",
        "count": 65
      },
      {
        "_id": "Low",
        "count": 45
      }
    ],
    "problemStats": [
      {
        "_id": "Diabetic Retinopathy",
        "count": 45,
        "avgConfidence": 87.2
      },
      {
        "_id": "Glaucoma",
        "count": 32,
        "avgConfidence": 91.5
      }
    ]
  }
}
```

---

## 🏥 Doctor Endpoints

### Get Doctors by City
**GET** `/api/doctors/city/:city`

Find doctors in a specific city.

**Parameters:**
- `city` (required): City name
- `type` (optional): `government` or `private`
- `specialization` (optional): Doctor specialization
- `limit` (optional): Number of results (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "doctors": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "Dr. Sarah Johnson",
        "specialization": "Retina Specialist",
        "hospital": "City Eye Hospital",
        "city": "Mumbai",
        "type": "private",
        "contact": "+91-9876543210",
        "address": "123 Medical Center, Mumbai",
        "experience": 15,
        "rating": 4.8,
        "isActive": true
      }
    ],
    "count": 1,
    "city": "Mumbai"
  }
}
```

### Get All Doctors
**GET** `/api/doctors`

Get all doctors with filtering and pagination.

**Query Parameters:**
- `city` (optional): Filter by city
- `type` (optional): Filter by type (`government` or `private`)
- `specialization` (optional): Filter by specialization
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)
- `sortBy` (optional): Sort field (default: `rating`)
- `sortOrder` (optional): `asc` or `desc` (default: `desc`)

**Response:**
```json
{
  "success": true,
  "data": {
    "doctors": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalDoctors": 200,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Get Doctor by ID
**GET** `/api/doctors/id/:id`

Get detailed information about a specific doctor.

**Parameters:**
- `id` (required): Doctor ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Dr. Sarah Johnson",
    "specialization": "Retina Specialist",
    "hospital": "City Eye Hospital",
    "city": "Mumbai",
    "type": "private",
    "contact": "+91-9876543210",
    "address": "123 Medical Center, Mumbai",
    "experience": 15,
    "rating": 4.8,
    "isActive": true,
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

### Add New Doctor
**POST** `/api/doctors/add`

Add a new doctor to the database (Admin only).

**Request Body:**
```json
{
  "name": "Dr. John Smith",
  "specialization": "Ophthalmologist",
  "hospital": "General Hospital",
  "city": "Delhi",
  "type": "government",
  "contact": "+91-9876543210",
  "address": "456 Medical Street, Delhi",
  "experience": 10,
  "rating": 4.5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Doctor added successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Dr. John Smith",
    "specialization": "Ophthalmologist",
    "hospital": "General Hospital",
    "city": "Delhi",
    "type": "government",
    "contact": "+91-9876543210",
    "address": "456 Medical Street, Delhi",
    "experience": 10,
    "rating": 4.5,
    "isActive": true,
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

### Update Doctor Rating
**PUT** `/api/doctors/:id/rating`

Update a doctor's rating.

**Parameters:**
- `id` (required): Doctor ID

**Request Body:**
```json
{
  "rating": 4.9
}
```

**Response:**
```json
{
  "success": true,
  "message": "Doctor rating updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Dr. Sarah Johnson",
    "rating": 4.9,
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

---

## 🔧 Utility Endpoints

### Health Check
**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "success": true,
  "message": "Eye Problem Detection API is running",
  "timestamp": "2023-09-06T10:30:00.000Z",
  "environment": "development"
}
```

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Field is required"]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Scan result not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## 📝 Notes

1. **File Upload Limits:**
   - Maximum file size: 10MB
   - Supported formats: JPEG, PNG, GIF, BMP, TIFF

2. **Rate Limiting:**
   - 100 requests per 15 minutes per IP address

3. **CORS:**
   - Configured for frontend URL (default: http://localhost:3000)

4. **AI Model Integration:**
   - Uses mock responses in development
   - Configurable via `USE_REAL_AI` environment variable

5. **Database:**
   - MongoDB with Mongoose ODM
   - Automatic indexing for performance

---

## 🧪 Testing

Use the provided test script:
```bash
node test-backend.js
```

Or test individual endpoints with curl:
```bash
# Health check
curl http://localhost:5000/health

# Upload image
curl -X POST -F "image=@retina.jpg" http://localhost:5000/api/upload

# Get doctors
curl http://localhost:5000/api/doctors/city/mumbai
``` 