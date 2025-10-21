#!/bin/bash

echo "🚀 Starting EyeCare AI Model API..."

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source .venv/bin/activate

# Install/upgrade dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if model weights exist
if [ ! -f "weights/model.pt" ]; then
    echo "⚠️  Warning: No model weights found at weights/model.pt"
    echo "   Please add your trained PyTorch model to continue"
    echo "   You can use the mock mode for testing without weights"
fi

# Start the API
echo "🌐 Starting FastAPI server..."
echo "   Health check: http://localhost:8001/health"
echo "   API docs: http://localhost:8001/docs"
echo "   Labels: http://localhost:8001/labels"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn app:app --host 0.0.0.0 --port 8001 --reload
