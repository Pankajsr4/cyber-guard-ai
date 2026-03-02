import requests
import json

response = requests.post(
    "http://localhost:8000/api/v1/privacy/redact",
    json={"content": "Contact me at john.doe@example.com or call 555-123-4567"}
)
print("Status:", response.status_code)
print("Response:", json.dumps(response.json(), indent=2))
