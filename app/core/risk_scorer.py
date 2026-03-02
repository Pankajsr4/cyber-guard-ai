"""Risk scoring engine"""
import re
from typing import List, Dict
from app.models import CategoryDetection, RiskScores, BehavioralAnalysis


class RiskScorer:
    """Calculates comprehensive risk scores"""
    
    def __init__(self):
        """Initialize risk scorer"""
        self.category_weights = {
            "hate_speech": 1.2,
            "harassment": 1.0,
            "violence": 1.3,
            "sexual_content": 0.9,
            "self_harm": 1.5,
            "extremism": 1.4,
            "scams": 0.8,
            "misinformation": 0.7,
            "manipulation": 0.9,
            "fake_reviews": 0.6,
            "political_manipulation": 0.8,
            "radicalization": 1.4,
        }
    
    def calculate_scores(
        self,
        content: str,
        detections: List[CategoryDetection],
        behavioral: BehavioralAnalysis
    ) -> RiskScores:
        """
        Calculate comprehensive risk scores
        
        Requirements: 2.1-2.10
        """
        # Calculate overall risk
        overall_risk = self._calculate_overall_risk(detections)
        
        # Calculate sentence-level scores
        sentence_scores = self._calculate_sentence_scores(content, detections)
        
        # Calculate paragraph-level scores
        paragraph_scores = self._calculate_paragraph_scores(content, detections)
        
        # Calculate category-wise scores
        category_scores = self._calculate_category_scores(detections)
        
        # Calculate intent score
        intent_score = self._calculate_intent_score(detections, behavioral)
        
        # Calculate escalation risk
        escalation_risk = self._calculate_escalation_risk(behavioral)
        
        # Calculate emotional intensity
        emotional_intensity = self._calculate_emotional_intensity(behavioral)
        
        # Calculate aggression index
        aggression_index = behavioral.hostility_score
        
        # Calculate psychological harm index
        psychological_harm_index = self._calculate_psychological_harm(behavioral)
        
        # Calculate confidence
        confidence = self._calculate_confidence(detections)
        
        return RiskScores(
            overall_risk=overall_risk,
            sentence_scores=sentence_scores,
            paragraph_scores=paragraph_scores,
            category_scores=category_scores,
            intent_score=intent_score,
            escalation_risk=escalation_risk,
            emotional_intensity=emotional_intensity,
            aggression_index=aggression_index,
            psychological_harm_index=psychological_harm_index,
            confidence=confidence
        )
    
    def _calculate_overall_risk(self, detections: List[CategoryDetection]) -> float:
        """Calculate overall risk score (0-100)"""
        if not detections:
            return 0.0
        
        weighted_sum = 0.0
        total_weight = 0.0
        
        for detection in detections:
            if detection.detected:
                weight = self.category_weights.get(detection.category.value, 1.0)
                weighted_sum += detection.severity * weight
                total_weight += weight
        
        if total_weight == 0:
            return 0.0
        
        return min(weighted_sum / total_weight, 100.0)
    
    def _calculate_sentence_scores(
        self,
        content: str,
        detections: List[CategoryDetection]
    ) -> List[float]:
        """Calculate sentence-level toxicity scores"""
        sentences = re.split(r'[.!?]+', content)
        scores = []
        
        for sentence in sentences:
            if sentence.strip():
                # Simple heuristic: check if sentence contains evidence
                score = 0.0
                for detection in detections:
                    if detection.detected:
                        for evidence in detection.evidence:
                            if evidence.lower() in sentence.lower():
                                score = max(score, detection.severity)
                scores.append(score)
        
        return scores if scores else [0.0]
    
    def _calculate_paragraph_scores(
        self,
        content: str,
        detections: List[CategoryDetection]
    ) -> List[float]:
        """Calculate paragraph-level risk scores"""
        paragraphs = content.split('\n\n')
        scores = []
        
        for paragraph in paragraphs:
            if paragraph.strip():
                # Calculate average sentence score for paragraph
                sentences = re.split(r'[.!?]+', paragraph)
                para_score = 0.0
                count = 0
                for sentence in sentences:
                    if sentence.strip():
                        for detection in detections:
                            if detection.detected:
                                for evidence in detection.evidence:
                                    if evidence.lower() in sentence.lower():
                                        para_score += detection.severity
                                        count += 1
                scores.append(para_score / max(count, 1))
        
        return scores if scores else [0.0]
    
    def _calculate_category_scores(
        self,
        detections: List[CategoryDetection]
    ) -> Dict[str, float]:
        """Calculate category-wise severity scores"""
        return {
            detection.category.value: detection.severity
            for detection in detections
            if detection.detected
        }
    
    def _calculate_intent_score(
        self,
        detections: List[CategoryDetection],
        behavioral: BehavioralAnalysis
    ) -> float:
        """Calculate deliberate harm intent score"""
        # Combine detection severity with behavioral indicators
        detection_score = sum(d.severity for d in detections if d.detected) / max(len(detections), 1)
        behavioral_score = (behavioral.manipulation_score + behavioral.dominance_score) / 2
        return min((detection_score + behavioral_score) / 2, 100.0)
    
    def _calculate_escalation_risk(self, behavioral: BehavioralAnalysis) -> float:
        """Calculate escalation risk score"""
        return min(
            (behavioral.hostility_score + behavioral.aggression_index + behavioral.anxiety_score) / 3,
            100.0
        )
    
    def _calculate_emotional_intensity(self, behavioral: BehavioralAnalysis) -> float:
        """Calculate emotional intensity score"""
        if not behavioral.emotions:
            return 0.0
        return min(sum(behavioral.emotions.values()) / len(behavioral.emotions) * 100, 100.0)
    
    def _calculate_psychological_harm(self, behavioral: BehavioralAnalysis) -> float:
        """Calculate psychological harm risk index"""
        factors = [
            behavioral.gaslighting_score,
            behavioral.manipulation_score,
            behavioral.anxiety_score,
            behavioral.crisis_confidence if behavioral.crisis_language_detected else 0.0
        ]
        return min(sum(factors) / len(factors), 100.0)
    
    def _calculate_confidence(self, detections: List[CategoryDetection]) -> float:
        """Calculate overall confidence score"""
        if not detections:
            return 0.0
        return sum(d.confidence for d in detections) / len(detections)
