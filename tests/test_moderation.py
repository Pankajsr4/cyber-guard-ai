"""Tests for moderation service"""
import pytest
from app.models import ModerationRequest, HarmCategory, ModerationAction
from app.services import ModerationService


@pytest.fixture
def moderation_service():
    """Create moderation service instance"""
    return ModerationService()


@pytest.mark.asyncio
async def test_basic_moderation(moderation_service):
    """Test basic content moderation"""
    request = ModerationRequest(content="This is a test message")
    result = await moderation_service.moderate_content(request)
    
    assert result.content_id is not None
    assert result.language.primary_language == "en"
    assert result.risk_scores.overall_risk >= 0
    assert result.risk_scores.overall_risk <= 100


@pytest.mark.asyncio
async def test_toxic_content_detection(moderation_service):
    """Test detection of toxic content"""
    request = ModerationRequest(
        content="I hate you, you stupid idiot!"
    )
    result = await moderation_service.moderate_content(request)
    
    # Should detect harassment or hate speech
    detected_categories = [d.category for d in result.detections if d.detected]
    assert len(detected_categories) > 0
    assert result.risk_scores.overall_risk > 30


@pytest.mark.asyncio
async def test_crisis_language_detection(moderation_service):
    """Test detection of crisis language"""
    request = ModerationRequest(
        content="I want to kill myself, I can't go on"
    )
    result = await moderation_service.moderate_content(request)
    
    # Should detect self-harm and crisis language
    assert result.behavioral_analysis.crisis_language_detected
    assert result.recommended_action == ModerationAction.REVIEW


@pytest.mark.asyncio
async def test_safe_content(moderation_service):
    """Test that safe content passes"""
    request = ModerationRequest(
        content="Hello, how are you today? I hope you're having a great day!"
    )
    result = await moderation_service.moderate_content(request)
    
    assert result.risk_scores.overall_risk < 30
    assert result.recommended_action == ModerationAction.ALLOW


@pytest.mark.asyncio
async def test_batch_moderation(moderation_service):
    """Test batch moderation"""
    requests = [
        ModerationRequest(content="Hello world"),
        ModerationRequest(content="This is a test"),
        ModerationRequest(content="Another message"),
    ]
    
    results = await moderation_service.moderate_batch(requests)
    
    assert len(results) == 3
    for result in results:
        assert result.content_id is not None
        assert result.risk_scores.overall_risk >= 0


@pytest.mark.asyncio
async def test_language_detection(moderation_service):
    """Test language detection"""
    # English
    request_en = ModerationRequest(content="This is English text")
    result_en = await moderation_service.moderate_content(request_en)
    assert result_en.language.primary_language == "en"
    
    # Spanish
    request_es = ModerationRequest(content="Esto es texto en español")
    result_es = await moderation_service.moderate_content(request_es)
    assert result_es.language.primary_language == "es"


def test_risk_score_bounds(moderation_service):
    """Property test: Risk scores should be within bounds"""
    from hypothesis import given, strategies as st
    
    @given(st.text(min_size=1, max_size=1000))
    @pytest.mark.asyncio
    async def check_bounds(content):
        request = ModerationRequest(content=content)
        result = await moderation_service.moderate_content(request)
        
        # All scores should be 0-100
        assert 0 <= result.risk_scores.overall_risk <= 100
        assert 0 <= result.risk_scores.confidence <= 100
        assert all(0 <= score <= 100 for score in result.risk_scores.sentence_scores)
    
    check_bounds()
