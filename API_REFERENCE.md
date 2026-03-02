# API Reference

Complete API documentation for Cyber-Guard AI Moderation Engine.

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

Currently open access. Future versions will support:
- API Key authentication
- JWT tokens
- OAuth 2.0

## Rate Limiting

Default limits (configurable):
- 60 requests per minute
- 1,000 requests per hour

## Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 422 | Validation Error - Check request format |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Endpoints

### 1. Analyze Content

Perform comprehensive analysis of text content.

**Endpoint**: `POST /api/v1/analyze`

**Request Body**:
```json
{
  "content": "string (required, 1-50000 chars)",
  "context": ["string"] (optional),
  "language": "string" (optional, auto-detected if not provided),
  "user_id": "string" (optional),
  "temporary_mode": boolean (optional, default: false)
}
```

**Response**: `ModerationResult`
```json
{
  "content_id": "uuid",
  "timestamp": "2024-01-01T00:00:00",
  "language": {
    "primary_language": "en",
    "all_languages": {"en": 1.0},
    "confidence": 95.0
  },
  "detections": [
    {
      "category": "harassment",
      "detected": true,
      "confidence": 85.0,
      "evidence": ["problematic text"],
      "severity": 75.0
    }
  ],
  "risk_scores": {
    "overall_risk": 65.0,
    "sentence_scores": [50.0, 80.0],
    "paragraph_scores": [65.0],
    "category_scores": {"harassment": 75.0},
    "intent_score": 60.0,
    "escalation_risk": 55.0,
    "emotional_intensity": 70.0,
    "aggression_index": 65.0,
    "psychological_harm_index": 50.0,
    "confidence": 85.0
  },
  "behavioral_analysis": {
    "sentiment": "negative",
    "emotions": {
      "anger": 0.8,
      "fear": 0.2,
      "joy": 0.0,
      "sadness": 0.3,
      "disgust": 0.5,
      "surprise": 0.1
    },
    "sarcasm_score": 25.0,
    "passive_aggressive_score": 50.0,
    "manipulation_score": 30.0,
    "gaslighting_score": 0.0,
    "dominance_score": 40.0,
    "hostility_score": 70.0,
    "anxiety_score": 20.0,
    "crisis_language_detected": false,
    "crisis_confidence": 0.0
  },
  "highlighted_spans": [
    {
      "start": 0,
      "end": 10,
      "text": "problematic",
      "category": "harassment",
      "severity": 75.0,
      "reason": "Contains harassing or bullying language"
    }
  ],
  "recommended_action": "review",
  "explanation": "Overall Risk: MEDIUM (65.0/100)...",
  "model_version": "1.0.0"
}
```

**Example**:
```bash
curl -X POST "http://localhost:8000/api/v1/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a test message",
    "language": "en"
  }'
```

---

### 2. Batch Analyze

Analyze multiple content items in a single request.

**Endpoint**: `POST /api/v1/analyze/batch`

**Request Body**:
```json
{
  "items": [
    {
      "content": "string",
      "context": ["string"],
      "language": "string",
      "user_id": "string",
      "temporary_mode": boolean
    }
  ]
}
```

**Limits**: Maximum 1,000 items per request

**Response**: `BulkModerationResult`
```json
{
  "results": [ModerationResult],
  "total_processed": 100,
  "processing_time_seconds": 15.5
}
```

**Example**:
```bash
curl -X POST "http://localhost:8000/api/v1/analyze/batch" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"content": "First message"},
      {"content": "Second message"},
      {"content": "Third message"}
    ]
  }'
```

---

### 3. Moderate Content

Real-time moderation with action recommendation.

**Endpoint**: `POST /api/v1/moderate`

**Request Body**: Same as `/analyze`

**Response**: Same as `/analyze`

**Difference**: Optimized for real-time use (<500ms target)

**Example**:
```bash
curl -X POST "http://localhost:8000/api/v1/moderate" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Real-time chat message",
    "user_id": "user123"
  }'
```

---

### 4. Rewrite Content

AI-assisted content rewriting for safer alternatives.

**Endpoint**: `POST /api/v1/rewrite`

**Request Body**:
```json
{
  "content": "string (required)",
  "target_tone": "string (optional, default: 'professional')",
  "preserve_meaning": boolean (optional, default: true)
}
```

**Target Tones**:
- `professional`: Business-appropriate language
- `neutral`: Emotionally neutral
- `softened`: Less aggressive

**Response**: `RewriteResult`
```json
{
  "original_content": "You're so stupid!",
  "rewritten_content": "You're uninformed.",
  "improvements": [
    "Replaced 'stupid' with 'uninformed' (Contains harassing or bullying language)",
    "Adjusted tone to be more professional"
  ],
  "risk_reduction": 45.0
}
```

**Example**:
```bash
curl -X POST "http://localhost:8000/api/v1/rewrite" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is terrible and you are stupid!",
    "target_tone": "professional"
  }'
```

---

### 5. Redact PII

Remove personally identifiable information from content.

**Endpoint**: `POST /api/v1/privacy/redact`

**Request Body**: `string` (raw content)

**Response**:
```json
{
  "original_length": 50,
  "redacted_content": "Contact me at [EMAIL] or [PHONE]"
}
```

**Redacted Patterns**:
- Email addresses → `[EMAIL]`
- Phone numbers → `[PHONE]`
- SSN → `[SSN]`
- Credit cards → `[CARD]`

**Example**:
```bash
curl -X POST "http://localhost:8000/api/v1/privacy/redact" \
  -H "Content-Type: application/json" \
  -d '"Contact me at john@example.com or 555-123-4567"'
```

---

### 6. Health Check

Check API health and status.

**Endpoint**: `GET /api/v1/health`

**Response**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "service": "CyberGuard AI Moderation Engine"
}
```

**Example**:
```bash
curl "http://localhost:8000/api/v1/health"
```

---

## Data Models

### HarmCategory (Enum)

```
hate_speech
harassment
violence
sexual_content
self_harm
extremism
scams
misinformation
manipulation
fake_reviews
political_manipulation
radicalization
```

### Sentiment (Enum)

```
positive
negative
neutral
```

### ModerationAction (Enum)

```
allow    - Content is safe
review   - Requires human review
block    - Should be blocked
delete   - Should be deleted
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Content is required"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "content"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 429 Rate Limit
```json
{
  "detail": "Rate limit exceeded. Try again in 60 seconds."
}
```

### 500 Internal Error
```json
{
  "detail": "Internal server error"
}
```

---

## Code Examples

### Python

```python
import requests

# Analyze content
response = requests.post(
    "http://localhost:8000/api/v1/analyze",
    json={"content": "Your text here"}
)
result = response.json()
print(f"Risk: {result['risk_scores']['overall_risk']}")

# Batch analyze
response = requests.post(
    "http://localhost:8000/api/v1/analyze/batch",
    json={
        "items": [
            {"content": "Message 1"},
            {"content": "Message 2"}
        ]
    }
)
results = response.json()
print(f"Processed: {results['total_processed']}")

# Rewrite content
response = requests.post(
    "http://localhost:8000/api/v1/rewrite",
    json={
        "content": "Problematic text",
        "target_tone": "professional"
    }
)
rewrite = response.json()
print(f"Improved: {rewrite['rewritten_content']}")
```

### JavaScript

```javascript
// Analyze content
const response = await fetch('http://localhost:8000/api/v1/analyze', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({content: 'Your text here'})
});
const result = await response.json();
console.log(`Risk: ${result.risk_scores.overall_risk}`);

// Batch analyze
const batchResponse = await fetch('http://localhost:8000/api/v1/analyze/batch', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    items: [
      {content: 'Message 1'},
      {content: 'Message 2'}
    ]
  })
});
const batchResult = await batchResponse.json();
console.log(`Processed: ${batchResult.total_processed}`);
```

### cURL

```bash
# Analyze
curl -X POST "http://localhost:8000/api/v1/analyze" \
  -H "Content-Type: application/json" \
  -d '{"content": "Your text"}'

# Batch
curl -X POST "http://localhost:8000/api/v1/analyze/batch" \
  -H "Content-Type: application/json" \
  -d '{"items": [{"content": "Text 1"}, {"content": "Text 2"}]}'

# Rewrite
curl -X POST "http://localhost:8000/api/v1/rewrite" \
  -H "Content-Type: application/json" \
  -d '{"content": "Text", "target_tone": "professional"}'

# Redact PII
curl -X POST "http://localhost:8000/api/v1/privacy/redact" \
  -H "Content-Type: application/json" \
  -d '"john@example.com"'
```

---

## Interactive Documentation

Visit `http://localhost:8000/docs` for:
- Interactive API testing
- Automatic request/response examples
- Schema validation
- Try-it-out functionality

Alternative documentation: `http://localhost:8000/redoc`

---

## Best Practices

1. **Batch Processing**: Use `/analyze/batch` for multiple items
2. **Language Detection**: Let the system auto-detect when possible
3. **Context**: Provide conversation context for better accuracy
4. **Temporary Mode**: Use for privacy-sensitive content
5. **Error Handling**: Always check response status codes
6. **Rate Limiting**: Implement exponential backoff on 429 errors

---

## Performance Tips

- Single analysis: <2 seconds
- Batch processing: ~30ms per item
- Real-time moderation: <500ms
- Use batch endpoint for >10 items
- Cache results for identical content
- Consider async processing for large batches

---

## Support

- Interactive Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health
- GitHub Issues: [Repository URL]
- Email: [Support Email]
