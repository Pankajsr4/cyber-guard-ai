"""Basic usage examples for Cyber-Guard AI"""
import asyncio
import httpx


async def analyze_content():
    """Example: Analyze single content"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/api/v1/analyze",
            json={
                "content": "This is a test message to analyze",
                "language": "en"
            }
        )
        result = response.json()
        print("Analysis Result:")
        print(f"Overall Risk: {result['risk_scores']['overall_risk']:.1f}/100")
        print(f"Recommended Action: {result['recommended_action']}")
        print(f"Explanation: {result['explanation']}")


async def batch_analyze():
    """Example: Batch analyze multiple items"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/api/v1/analyze/batch",
            json={
                "items": [
                    {"content": "First message"},
                    {"content": "Second message"},
                    {"content": "Third message"}
                ]
            }
        )
        result = response.json()
        print(f"\nBatch Analysis:")
        print(f"Total Processed: {result['total_processed']}")
        print(f"Processing Time: {result['processing_time_seconds']:.2f}s")


async def rewrite_content():
    """Example: Rewrite problematic content"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/api/v1/rewrite",
            json={
                "content": "You're so stupid and dumb!",
                "target_tone": "professional"
            }
        )
        result = response.json()
        print("\nRewrite Result:")
        print(f"Original: {result['original_content']}")
        print(f"Rewritten: {result['rewritten_content']}")
        print(f"Risk Reduction: {result['risk_reduction']:.1f}%")


async def redact_pii():
    """Example: Redact PII from content"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/api/v1/privacy/redact",
            json="Contact me at john.doe@example.com or call 555-123-4567"
        )
        result = response.json()
        print("\nPII Redaction:")
        print(f"Redacted: {result['redacted_content']}")


async def main():
    """Run all examples"""
    print("=== Cyber-Guard AI Examples ===\n")
    
    await analyze_content()
    await batch_analyze()
    await rewrite_content()
    await redact_pii()


if __name__ == "__main__":
    asyncio.run(main())
