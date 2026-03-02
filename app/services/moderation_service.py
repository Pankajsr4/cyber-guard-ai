"""Main moderation orchestration service"""
import uuid
from datetime import datetime
from typing import List
from app.models import (
    ModerationRequest,
    ModerationResult,
    ModerationAction,
)
from app.core import (
    LanguageDetector,
    ToxicityDetector,
    RiskScorer,
    BehavioralAnalyzer,
    ContextProcessor,
    ExplainabilityEngine,
    AIAssistant,
)


class ModerationService:
    """Orchestrates the moderation pipeline"""
    
    def __init__(self):
        """Initialize moderation service with all components"""
        self.language_detector = LanguageDetector()
        self.toxicity_detector = ToxicityDetector()
        self.risk_scorer = RiskScorer()
        self.behavioral_analyzer = BehavioralAnalyzer()
        self.context_processor = ContextProcessor()
        self.explainability = ExplainabilityEngine()
        self.ai_assistant = AIAssistant()
        self.model_version = "1.0.0"
    
    async def moderate_content(self, request: ModerationRequest) -> ModerationResult:
        """
        Perform complete moderation analysis
        
        Requirements: All requirements integrated
        """
        # Generate unique content ID
        content_id = str(uuid.uuid4())
        
        # Detect language
        language = self.language_detector.detect(request.content)
        
        # Process content with context awareness
        processed_content = self.context_processor.process(
            request.content,
            request.context
        )
        
        # Detect toxicity and harmful content
        detections = self.toxicity_detector.detect(
            processed_content,
            language.primary_language
        )
        
        # Perform behavioral analysis
        behavioral = self.behavioral_analyzer.analyze(processed_content)
        
        # Calculate risk scores
        risk_scores = self.risk_scorer.calculate_scores(
            processed_content,
            detections,
            behavioral
        )
        
        # Generate highlights
        highlights = self.explainability.generate_highlights(
            request.content,
            detections
        )
        
        # Determine recommended action
        recommended_action = self._determine_action(risk_scores.overall_risk, behavioral)
        
        # Create result
        result = ModerationResult(
            content_id=content_id,
            timestamp=datetime.utcnow(),
            language=language,
            detections=detections,
            risk_scores=risk_scores,
            behavioral_analysis=behavioral,
            highlighted_spans=highlights,
            recommended_action=recommended_action,
            explanation="",  # Will be filled next
            model_version=self.model_version
        )
        
        # Generate explanation
        result.explanation = self.explainability.generate_explanation(result)
        
        return result
    
    async def moderate_batch(
        self,
        requests: List[ModerationRequest]
    ) -> List[ModerationResult]:
        """
        Perform batch moderation
        
        Requirements: 11.3, 11.8
        """
        results = []
        for request in requests:
            result = await self.moderate_content(request)
            results.append(result)
        return results
    
    def _determine_action(
        self,
        overall_risk: float,
        behavioral: "BehavioralAnalysis"
    ) -> ModerationAction:
        """Determine recommended moderation action"""
        # Crisis language always requires immediate review
        if behavioral.crisis_language_detected:
            return ModerationAction.REVIEW
        
        # Risk-based thresholds
        if overall_risk >= 80:
            return ModerationAction.BLOCK
        elif overall_risk >= 50:
            return ModerationAction.REVIEW
        elif overall_risk >= 30:
            return ModerationAction.REVIEW
        
        return ModerationAction.ALLOW
