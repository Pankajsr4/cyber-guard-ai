# Cyber-Guard AI Moderation Engine

A comprehensive multi-layer AI moderation engine that detects harmful content, analyzes behavioral patterns, provides explainable risk assessments, and offers AI-assisted content improvement.

## Features

### Core Detection
- **Text Toxicity Detection**: Identifies 12+ categories of harmful content
- **Multi-Category Analysis**: Hate speech, harassment, violence, sexual content, self-harm, extremism, scams, misinformation, manipulation, and more
- **Confidence Scoring**: Each detection includes confidence levels (0-100)

### Risk Scoring
- Overall risk score (0-100)
- Sentence-level toxicity scores
- Paragraph-level risk scores
- Category-wise severity scores
- Intent analysis, escalation risk, emotional intensity
- Aggression index and psychological harm index

### Behavioral Analysis
- Sentiment analysis (positive, negative, neutral)
- Emotion detection (anger, fear, joy, sadness, disgust, surprise)
- Sarcasm, passive-aggressive, manipulation detection
- Gaslighting, dominance, hostility patterns
- Crisis language detection with immediate alerts

### Context-Aware Processing
- Quoted text differentiation
- Code snippet neutralization
- Slang interpretation
- Multilingual support (50+ languages)
- Conversation context tracking (up to 50 messages)
- Escalation pattern detection

### Explainability
- Inline highlighting of problematic text
- Risk heatmaps and visualizations
- Category distribution charts
- Detailed explanations for all decisions
- Model version audit logs

### AI Assistance
- Auto-safe content rewriting
- Tone softening suggestions
- PII redaction (email, phone, SSN, credit cards)
- Professional tone conversion
- Context-sensitive improvements

### Enterprise Features
- RESTful API with authentication
- Bulk processing (up to 1,000 items)
- Real-time moderation (<500ms)
- Webhook notifications
- Rate limiting
- GDPR compliance

## Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cyber-guard-ai

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your configuration
```

### Running the Server

```bash
# Development mode
python app/main.py

# Or with uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

### Docker

```bash
# Build image
docker build -t cyberguard-ai .

# Run container
docker run -p 8000:8000 cyberguard-ai
```

## API Usage

### Analyze Content

```bash
curl -X POST "http://localhost:8000/api/v1/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your text content here",
    "language": "en",
    "temporary_mode": false
  }'
```

### Batch Analysis

```bash
curl -X POST "http://localhost:8000/api/v1/analyze/batch" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"content": "First text"},
      {"content": "Second text"}
    ]
  }'
```

### Rewrite Content

```bash
curl -X POST "http://localhost:8000/api/v1/rewrite" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your text here",
    "target_tone": "professional",
    "preserve_meaning": true
  }'
```

### Redact PII

```bash
curl -X POST "http://localhost:8000/api/v1/privacy/redact" \
  -H "Content-Type: application/json" \
  -d '"Contact me at john@example.com or 555-123-4567"'
```

## Response Format

```json
{
  "content_id": "uuid",
  "timestamp": "2024-01-01T00:00:00",
  "language": {
    "primary_language": "en",
    "confidence": 95.0
  },
  "detections": [
    {
      "category": "harassment",
      "detected": true,
      "confidence": 85.0,
      "severity": 75.0,
      "evidence": ["problematic text"]
    }
  ],
  "risk_scores": {
    "overall_risk": 65.0,
    "sentence_scores": [50.0, 80.0],
    "confidence": 85.0
  },
  "behavioral_analysis": {
    "sentiment": "negative",
    "emotions": {"anger": 0.8},
    "hostility_score": 70.0
  },
  "recommended_action": "review",
  "explanation": "Overall Risk: MEDIUM (65.0/100)..."
}
```

## Architecture

```
┌─────────────────────────────────────────┐
│           FastAPI Application            │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│        Moderation Service                │
│  (Orchestrates all components)           │
└─────────────────────────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
┌───▼────┐   ┌─────▼─────┐   ┌────▼────┐
│Language│   │ Toxicity  │   │  Risk   │
│Detector│   │ Detector  │   │ Scorer  │
└────────┘   └───────────┘   └─────────┘
    │               │               │
┌───▼────┐   ┌─────▼─────┐   ┌────▼────┐
│Context │   │Behavioral │   │Explain- │
│Process │   │ Analyzer  │   │ability  │
└────────┘   └───────────┘   └─────────┘
                    │
              ┌─────▼─────┐
              │    AI     │
              │ Assistant │
              └───────────┘
```

## Configuration

Key environment variables:

```bash
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# ML Models
MODEL_CACHE_DIR=./models
MODEL_DEVICE=cpu  # or cuda for GPU

# Privacy
ENABLE_PII_REDACTION=true
DATA_RETENTION_DAYS=30

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_HOUR=1000
```

## Performance

- Single content analysis: <2 seconds
- Real-time chat moderation: <500ms
- Batch processing: 1,000 items in <30 seconds
- Language detection: <100ms
- Throughput: 1,000+ requests/second (with scaling)

## Requirements

- Python 3.8+
- 4GB RAM minimum (8GB recommended)
- CPU or GPU (GPU recommended for production)

## License

[Your License Here]

## Support

For issues, questions, or contributions, please visit [repository-url]
