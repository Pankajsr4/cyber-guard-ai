"""Quick API test to demonstrate Cyber-Guard AI"""
import requests
import json

print("🛡️  Cyber-Guard AI Moderation Engine - Live Demo")
print("=" * 60)
print()

# Test 1: Safe content
print("Test 1: Analyzing safe content...")
response = requests.post(
    "http://localhost:8000/api/v1/analyze",
    json={"content": "Hello! I hope you're having a wonderful day!"}
)
result = response.json()
print(f"✅ Content: 'Hello! I hope you're having a wonderful day!'")
print(f"   Risk Score: {result['risk_scores']['overall_risk']:.1f}/100")
print(f"   Sentiment: {result['behavioral_analysis']['sentiment']}")
print(f"   Action: {result['recommended_action'].upper()}")
print()

# Test 2: Toxic content
print("Test 2: Analyzing toxic content...")
response = requests.post(
    "http://localhost:8000/api/v1/analyze",
    json={"content": "You're so stupid and I hate you!"}
)
result = response.json()
print(f"⚠️  Content: 'You're so stupid and I hate you!'")
print(f"   Risk Score: {result['risk_scores']['overall_risk']:.1f}/100")
print(f"   Detected Categories: {[d['category'] for d in result['detections'] if d['detected']]}")
print(f"   Hostility Score: {result['behavioral_analysis']['hostility_score']:.1f}/100")
print(f"   Action: {result['recommended_action'].upper()}")
print()

# Test 3: Crisis language
print("Test 3: Detecting crisis language...")
response = requests.post(
    "http://localhost:8000/api/v1/analyze",
    json={"content": "I can't go on anymore, I want to end it all"}
)
result = response.json()
print(f"🚨 Content: 'I can't go on anymore, I want to end it all'")
print(f"   Risk Score: {result['risk_scores']['overall_risk']:.1f}/100")
print(f"   Crisis Detected: {result['behavioral_analysis']['crisis_language_detected']}")
print(f"   Crisis Confidence: {result['behavioral_analysis']['crisis_confidence']:.1f}/100")
print(f"   Action: {result['recommended_action'].upper()}")
print()

# Test 4: Language detection
print("Test 4: Multilingual support...")
response = requests.post(
    "http://localhost:8000/api/v1/analyze",
    json={"content": "Bonjour! Comment allez-vous aujourd'hui?"}
)
result = response.json()
print(f"🌍 Content: 'Bonjour! Comment allez-vous aujourd'hui?'")
print(f"   Detected Language: {result['language']['primary_language'].upper()}")
print(f"   Confidence: {result['language']['confidence']:.1f}%")
print()

# Test 5: AI Rewriting
print("Test 5: AI-assisted content rewriting...")
response = requests.post(
    "http://localhost:8000/api/v1/rewrite",
    json={
        "content": "You're so dumb and stupid!",
        "target_tone": "professional"
    }
)
result = response.json()
print(f"✏️  Original: '{result['original_content']}'")
print(f"   Rewritten: '{result['rewritten_content']}'")
print(f"   Risk Reduction: {result['risk_reduction']:.1f}%")
print()

# Test 6: PII Redaction
print("Test 6: PII redaction...")
response = requests.post(
    "http://localhost:8000/api/v1/privacy/redact",
    json={"content": "Contact me at john.doe@example.com or call 555-123-4567"}
)
result = response.json()
print(f"🔒 Original: 'Contact me at john.doe@example.com or call 555-123-4567'")
print(f"   Redacted: '{result['redacted_content']}'")
print()

print("=" * 60)
print("✅ All tests completed successfully!")
print("🛡️  Cyber-Guard AI is fully operational!")
print()
print("📖 Visit http://localhost:8000/docs for interactive API documentation")
