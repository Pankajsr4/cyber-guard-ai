"""Data models and schemas"""
from datetime import datetime
from typing import Dict, List, Optional
from enum import Enum
from pydantic import BaseModel, Field


class HarmCategory(str, Enum):
    """Harmful content categories"""
    HATE_SPEECH = "hate_speech"
    HARASSMENT = "harassment"
    VIOLENCE = "violence"
    SEXUAL_CONTENT = "sexual_content"
    SELF_HARM = "self_harm"
    EXTREMISM = "extremism"
    SCAMS = "scams"
    MISINFORMATION = "misinformation"
    MANIPULATION = "manipulation"
    FAKE_REVIEWS = "fake_reviews"
    POLITICAL_MANIPULATION = "political_manipulation"
    RADICALIZATION = "radicalization"


class Sentiment(str, Enum):
    """Sentiment classification"""
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"


class ModerationAction(str, Enum):
    """Moderation action recommendations"""
    ALLOW = "allow"
    REVIEW = "review"
    BLOCK = "block"
    DELETE = "delete"


class CategoryDetection(BaseModel):
    """Detection result for a specific harm category"""
    category: HarmCategory
    detected: bool
    confidence: float = Field(ge=0.0, le=100.0)
    evidence: List[str] = []
    severity: float = Field(ge=0.0, le=100.0)


class RiskScores(BaseModel):
    """Comprehensive risk scoring"""
    overall_risk: float = Field(ge=0.0, le=100.0)
    sentence_scores: List[float] = []
    paragraph_scores: List[float] = []
    category_scores: Dict[str, float] = {}
    intent_score: float = Field(ge=0.0, le=100.0)
    escalation_risk: float = Field(ge=0.0, le=100.0)
    emotional_intensity: float = Field(ge=0.0, le=100.0)
    aggression_index: float = Field(ge=0.0, le=100.0)
    psychological_harm_index: float = Field(ge=0.0, le=100.0)
    confidence: float = Field(ge=0.0, le=100.0)


class BehavioralAnalysis(BaseModel):
    """Behavioral and tone analysis results"""
    sentiment: Sentiment
    emotions: Dict[str, float] = {}
    sarcasm_score: float = Field(ge=0.0, le=100.0)
    passive_aggressive_score: float = Field(ge=0.0, le=100.0)
    manipulation_score: float = Field(ge=0.0, le=100.0)
    gaslighting_score: float = Field(ge=0.0, le=100.0)
    dominance_score: float = Field(ge=0.0, le=100.0)
    hostility_score: float = Field(ge=0.0, le=100.0)
    anxiety_score: float = Field(ge=0.0, le=100.0)
    crisis_language_detected: bool = False
    crisis_confidence: float = Field(ge=0.0, le=100.0, default=0.0)
    aggression_index: float = Field(ge=0.0, le=100.0, default=0.0)


class LanguageDetection(BaseModel):
    """Language detection results"""
    primary_language: str
    all_languages: Dict[str, float] = {}
    confidence: float = Field(ge=0.0, le=100.0)


class HighlightedSpan(BaseModel):
    """Highlighted problematic text span"""
    start: int
    end: int
    text: str
    category: HarmCategory
    severity: float
    reason: str


class ModerationRequest(BaseModel):
    """Request for content moderation"""
    content: str = Field(min_length=1, max_length=50000)
    context: Optional[List[str]] = None
    language: Optional[str] = None
    user_id: Optional[str] = None
    temporary_mode: bool = False


class ModerationResult(BaseModel):
    """Complete moderation analysis result"""
    content_id: str
    timestamp: datetime
    language: LanguageDetection
    detections: List[CategoryDetection]
    risk_scores: RiskScores
    behavioral_analysis: BehavioralAnalysis
    highlighted_spans: List[HighlightedSpan]
    recommended_action: ModerationAction
    explanation: str
    model_version: str


class RewriteRequest(BaseModel):
    """Request for content rewriting"""
    content: str
    target_tone: Optional[str] = "professional"
    preserve_meaning: bool = True


class RewriteResult(BaseModel):
    """AI-assisted rewrite result"""
    original_content: str
    rewritten_content: str
    improvements: List[str]
    risk_reduction: float


class BulkModerationRequest(BaseModel):
    """Bulk moderation request"""
    items: List[ModerationRequest] = Field(max_length=1000)


class BulkModerationResult(BaseModel):
    """Bulk moderation results"""
    results: List[ModerationResult]
    total_processed: int
    processing_time_seconds: float
