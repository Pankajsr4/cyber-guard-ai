"""Explainability and reporting module"""
import re
from typing import List
from app.models import (
    CategoryDetection,
    HighlightedSpan,
    HarmCategory,
    ModerationResult
)


class ExplainabilityEngine:
    """Generates explanations for moderation decisions"""
    
    def __init__(self):
        """Initialize explainability engine"""
        pass
    
    def generate_highlights(
        self,
        content: str,
        detections: List[CategoryDetection]
    ) -> List[HighlightedSpan]:
        """
        Generate inline highlighting for problematic text
        
        Requirements: 5.1
        """
        highlights = []
        
        for detection in detections:
            if detection.detected and detection.evidence:
                for evidence in detection.evidence:
                    # Find all occurrences of evidence in content
                    pattern = re.escape(evidence[:50])  # Use first 50 chars
                    for match in re.finditer(pattern, content, re.IGNORECASE):
                        highlight = HighlightedSpan(
                            start=match.start(),
                            end=match.end(),
                            text=match.group(),
                            category=detection.category,
                            severity=detection.severity,
                            reason=self._get_reason(detection.category)
                        )
                        highlights.append(highlight)
        
        return highlights
    
    def generate_explanation(self, result: ModerationResult) -> str:
        """
        Generate human-readable explanation
        
        Requirements: 5.1-5.10
        """
        explanation_parts = []
        
        # Overall risk assessment
        risk_level = self._get_risk_level(result.risk_scores.overall_risk)
        explanation_parts.append(
            f"Overall Risk: {risk_level} ({result.risk_scores.overall_risk:.1f}/100)"
        )
        
        # Detected categories
        detected_categories = [d for d in result.detections if d.detected]
        if detected_categories:
            explanation_parts.append("\nDetected Issues:")
            for detection in detected_categories:
                explanation_parts.append(
                    f"- {detection.category.value.replace('_', ' ').title()}: "
                    f"{detection.confidence:.1f}% confidence"
                )
        
        # Behavioral insights
        if result.behavioral_analysis.crisis_language_detected:
            explanation_parts.append(
                "\n⚠️ ALERT: Crisis language detected. Immediate attention recommended."
            )
        
        if result.behavioral_analysis.sentiment.value == "negative":
            explanation_parts.append(
                f"\nTone: Negative sentiment with {result.behavioral_analysis.hostility_score:.1f}/100 hostility"
            )
        
        # Recommendations
        explanation_parts.append(f"\nRecommended Action: {result.recommended_action.value.upper()}")
        
        return "\n".join(explanation_parts)
    
    def _get_reason(self, category: HarmCategory) -> str:
        """Get explanation for why content was flagged"""
        reasons = {
            HarmCategory.HATE_SPEECH: "Contains hate speech or discriminatory language",
            HarmCategory.HARASSMENT: "Contains harassing or bullying language",
            HarmCategory.VIOLENCE: "Contains violent or threatening content",
            HarmCategory.SEXUAL_CONTENT: "Contains explicit sexual content",
            HarmCategory.SELF_HARM: "Contains self-harm or suicide-related content",
            HarmCategory.EXTREMISM: "Contains extremist or radical content",
            HarmCategory.SCAMS: "Contains potential scam or fraud indicators",
            HarmCategory.MISINFORMATION: "Contains potential misinformation",
            HarmCategory.MANIPULATION: "Contains manipulative language",
            HarmCategory.FAKE_REVIEWS: "Appears to be a fake or inauthentic review",
            HarmCategory.POLITICAL_MANIPULATION: "Contains political manipulation tactics",
            HarmCategory.RADICALIZATION: "Contains radicalization indicators",
        }
        return reasons.get(category, "Flagged for review")
    
    def _get_risk_level(self, score: float) -> str:
        """Convert risk score to risk level"""
        if score < 30:
            return "LOW"
        elif score < 60:
            return "MEDIUM"
        elif score < 80:
            return "HIGH"
        return "CRITICAL"
