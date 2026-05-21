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
        Generate human-readable explanation for ALL content types

        Requirements: 5.1-5.10
        """
        explanation_parts = []
        risk = result.risk_scores.overall_risk
        sentiment = result.behavioral_analysis.sentiment.value
        emotions = result.behavioral_analysis.emotions or {}
        detected_categories = [d for d in result.detections if d.detected]

        # --- Risk level header ---
        risk_level = self._get_risk_level(risk)
        explanation_parts.append(
            f"Overall Risk: {risk_level} ({risk:.1f}/100)"
        )

        # --- Positive / safe content feedback ---
        if risk < 30 and not detected_categories:
            if sentiment == "positive":
                dominant_emotion = max(emotions, key=emotions.get) if emotions else None
                if dominant_emotion == "joy" and emotions.get("joy", 0) > 0:
                    explanation_parts.append(
                        "\n✅ This content is cheerful and joyful. No harmful content detected."
                    )
                else:
                    explanation_parts.append(
                        "\n✅ This content is positive and safe. No harmful content detected."
                    )
            elif sentiment == "neutral":
                explanation_parts.append(
                    "\n✅ This content appears neutral and safe. No harmful content detected."
                )
            else:
                explanation_parts.append(
                    "\n✅ Content passed moderation checks. No harmful content detected."
                )

        # --- Emotion insights (for all content) ---
        top_emotions = sorted(
            [(k, v) for k, v in emotions.items() if v > 0],
            key=lambda x: x[1], reverse=True
        )[:2]
        if top_emotions:
            emotion_str = ", ".join(
                f"{e.capitalize()} ({v*100:.0f}%)" for e, v in top_emotions
            )
            explanation_parts.append(f"\nDetected Emotions: {emotion_str}")

        # --- Sentiment tone ---
        tone_map = {
            "positive": "😊 Positive — content has an uplifting, friendly tone.",
            "negative": "😠 Negative — content has a hostile or unfriendly tone.",
            "neutral":  "😐 Neutral — content has a balanced, informational tone.",
        }
        explanation_parts.append(f"\nTone: {tone_map.get(sentiment, 'Unknown')}")

        # --- Harmful content details ---
        if detected_categories:
            explanation_parts.append("\n⚠️ Detected Issues:")
            for detection in detected_categories:
                explanation_parts.append(
                    f"  - {detection.category.value.replace('_', ' ').title()}: "
                    f"{detection.confidence:.1f}% confidence"
                )

        # --- Crisis alert ---
        if result.behavioral_analysis.crisis_language_detected:
            explanation_parts.append(
                "\n🚨 ALERT: Crisis language detected. Immediate attention recommended."
            )

        # --- Hostility note (only when relevant) ---
        if result.behavioral_analysis.hostility_score > 30:
            explanation_parts.append(
                f"\nHostility Level: {result.behavioral_analysis.hostility_score:.1f}/100"
            )

        # --- Recommended action ---
        action_map = {
            "allow":  "✅ ALLOW — Content is safe to publish.",
            "review": "🔍 REVIEW — Content needs human review before publishing.",
            "block":  "🚫 BLOCK — Content violates guidelines and should not be published.",
        }
        action = result.recommended_action.value.lower()
        explanation_parts.append(
            f"\nRecommended Action: {action_map.get(action, action.upper())}"
        )

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
