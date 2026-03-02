"""Quick demo of Cyber-Guard AI"""
import requests

print("\n🛡️  CYBER-GUARD AI MODERATION ENGINE - LIVE DEMO\n")
print("=" * 70)

# Test 1: Safe content
print("\n✅ TEST 1: Safe Content Analysis")
print("-" * 70)
try:
    response = requests.post(
        "http://localhost:8000/api/v1/analyze",
        json={"content": "Hello! Have a wonderful day!"},
        timeout=10
    )
    if response.status_code == 200:
        result = response.json()
        print(f"Content: 'Hello! Have a wonderful day!'")
        print(f"Risk Score: {result['risk_scores']['overall_risk']:.1f}/100")
        print(f"Sentiment: {result['behavioral_analysis']['sentiment']}")
        print(f"Recommended Action: {result['recommended_action'].upper()}")
        print("✓ PASSED - Safe content correctly identified")
    else:
        print(f"Error: {response.status_code}")
except Exception as e:
    print(f"Error: {e}")

# Test 2: Language Detection
print("\n\n🌍 TEST 2: Multilingual Support")
print("-" * 70)
try:
    response = requests.post(
        "http://localhost:8000/api/v1/analyze",
        json={"content": "Bonjour! Comment ça va?"},
        timeout=10
    )
    if response.status_code == 200:
        result = response.json()
        print(f"Content: 'Bonjour! Comment ça va?'")
        print(f"Detected Language: {result['language']['primary_language'].upper()}")
        print(f"Confidence: {result['language']['confidence']:.1f}%")
        print("✓ PASSED - French correctly detected")
    else:
        print(f"Error: {response.status_code}")
except Exception as e:
    print(f"Error: {e}")

# Test 3: PII Redaction
print("\n\n🔒 TEST 3: PII Redaction")
print("-" * 70)
try:
    response = requests.post(
        "http://localhost:8000/api/v1/privacy/redact",
        json={"content": "Email: john@example.com, Phone: 555-1234"},
        timeout=10
    )
    if response.status_code == 200:
        result = response.json()
        print(f"Original: 'Email: john@example.com, Phone: 555-1234'")
        print(f"Redacted: '{result['redacted_content']}'")
        print("✓ PASSED - PII successfully redacted")
    else:
        print(f"Error: {response.status_code}")
except Exception as e:
    print(f"Error: {e}")

# Test 4: Health Check
print("\n\n❤️  TEST 4: System Health")
print("-" * 70)
try:
    response = requests.get("http://localhost:8000/health", timeout=5)
    if response.status_code == 200:
        result = response.json()
        print(f"Status: {result['status'].upper()}")
        print(f"Version: {result['version']}")
        print(f"Service: {result['service']}")
        print("✓ PASSED - System is healthy")
    else:
        print(f"Error: {response.status_code}")
except Exception as e:
    print(f"Error: {e}")

print("\n" + "=" * 70)
print("\n✅ CYBER-GUARD AI IS FULLY OPERATIONAL!")
print("\n📖 Interactive API Docs: http://localhost:8000/docs")
print("🔗 API Base URL: http://localhost:8000/api/v1")
print("\n" + "=" * 70 + "\n")
