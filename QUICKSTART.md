# Quick Start Guide

Get Cyber-Guard AI Moderation Engine running in 5 minutes!

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- 4GB RAM minimum

## Installation

### Option 1: Quick Start Script (Recommended)

**Windows:**
```bash
run.bat
```

**Linux/Mac:**
```bash
chmod +x run.sh
./run.sh
```

The script will:
1. Create a virtual environment
2. Install all dependencies
3. Download required NLTK data
4. Create configuration file
5. Start the server

### Option 2: Manual Installation

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

# Create configuration
cp .env.example .env

# Start server
python app/main.py
```

## Verify Installation

Once the server is running, open your browser:

- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## First API Call

### Using curl:

```bash
curl -X POST "http://localhost:8000/api/v1/analyze" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello, this is a test message"}'
```

### Using Python:

```python
import requests

response = requests.post(
    "http://localhost:8000/api/v1/analyze",
    json={"content": "Hello, this is a test message"}
)

result = response.json()
print(f"Risk Score: {result['risk_scores']['overall_risk']}")
print(f"Action: {result['recommended_action']}")
```

### Using the Interactive Docs:

1. Go to http://localhost:8000/docs
2. Click on "POST /api/v1/analyze"
3. Click "Try it out"
4. Enter your content in the request body
5. Click "Execute"

## Example Requests

### Analyze Content
```bash
curl -X POST "http://localhost:8000/api/v1/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your text here",
    "language": "en"
  }'
```

### Batch Analysis
```bash
curl -X POST "http://localhost:8000/api/v1/analyze/batch" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"content": "First message"},
      {"content": "Second message"}
    ]
  }'
```

### Rewrite Content
```bash
curl -X POST "http://localhost:8000/api/v1/rewrite" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your text here",
    "target_tone": "professional"
  }'
```

### Redact PII
```bash
curl -X POST "http://localhost:8000/api/v1/privacy/redact" \
  -H "Content-Type: application/json" \
  -d '"Contact me at john@example.com or 555-123-4567"'
```

## Run Examples

```bash
# Make sure the server is running first
python examples/basic_usage.py
```

## Run Tests

```bash
pytest tests/ -v
```

## Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Troubleshooting

### Port Already in Use
If port 8000 is already in use, edit `.env`:
```
API_PORT=8001
```

### Import Errors
Make sure virtual environment is activated:
```bash
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

### NLTK Data Missing
Download manually:
```python
import nltk
nltk.download('punkt')
nltk.download('stopwords')
```

### Model Download Issues
The Detoxify model will download automatically on first use. Ensure you have internet connection and ~500MB free space.

## Next Steps

1. Read the full [README.md](README.md) for detailed documentation
2. Explore the [API documentation](http://localhost:8000/docs)
3. Check out [examples/](examples/) for more usage patterns
4. Review [requirements.md](.kiro/specs/cyber-guard-ai-moderation-engine/requirements.md) for all features

## Support

For issues or questions:
- Check the [README.md](README.md)
- Review the API docs at `/docs`
- Check existing issues in the repository

## What's Included

✅ Text toxicity detection (12+ categories)
✅ Risk scoring (overall, sentence, paragraph levels)
✅ Behavioral analysis (sentiment, emotions, patterns)
✅ Language detection (50+ languages)
✅ Context-aware processing
✅ AI-assisted rewriting
✅ PII redaction
✅ Real-time and batch processing
✅ REST API with OpenAPI docs
✅ Docker deployment ready

Enjoy using Cyber-Guard AI! 🛡️
