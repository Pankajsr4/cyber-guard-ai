"""Toxicity detection module"""
from typing import List, Dict
from detoxify import Detoxify
from app.models import HarmCategory, CategoryDetection


class ToxicityDetector:
    """Detects toxic and harmful content"""
    
    def __init__(self):
        """Initialize toxicity detector with pre-trained models"""
        self.model = Detoxify('original')
        
        # Map Detoxify categories to our harm categories
        self.category_mapping = {
            'toxicity': HarmCategory.HARASSMENT,
            'severe_toxicity': HarmCategory.VIOLENCE,
            'obscene': HarmCategory.SEXUAL_CONTENT,
            'threat': HarmCategory.VIOLENCE,
            'insult': HarmCategory.HARASSMENT,
            'identity_hate': HarmCategory.HATE_SPEECH,
        }
    
    def detect(self, content: str, language: str = "en") -> List[CategoryDetection]:
        """
        Detect harmful content across multiple categories
        
        Requirements: 1.1-1.5
        """
        detections = []
        
        try:
            # Get predictions from Detoxify
            results = self.model.predict(content)
            
            # Process each category
            for key, score in results.items():
                if key in self.category_mapping:
                    category = self.category_mapping[key]
                    confidence = float(score) * 100
                    detected = confidence > 50.0
                    
                    detection = CategoryDetection(
                        category=category,
                        detected=detected,
                        confidence=confidence,
                        evidence=[content[:100]] if detected else [],
                        severity=confidence
                    )
                    detections.append(detection)
            
            # Add additional categories with basic heuristics
            detections.extend(self._detect_additional_categories(content))
            
        except Exception as e:
            # Return empty detections on error
            pass
        
        return detections
    
    def _detect_additional_categories(self, content: str) -> List[CategoryDetection]:
        """Detect additional harm categories using heuristics"""
        additional = []
        content_lower = content.lower()
        
        # Self-harm detection
        self_harm_keywords = ['suicide', 'kill myself', 'end my life', 'self harm']
        self_harm_score = sum(1 for kw in self_harm_keywords if kw in content_lower) * 25
        if self_harm_score > 0:
            additional.append(CategoryDetection(
                category=HarmCategory.SELF_HARM,
                detected=self_harm_score > 50,
                confidence=min(self_harm_score, 100.0),
                evidence=[content[:100]],
                severity=min(self_harm_score, 100.0)
            ))
        
        # Extremism detection
        extremism_keywords = ['terrorist', 'extremist', 'radical', 'jihad']
        extremism_score = sum(1 for kw in extremism_keywords if kw in content_lower) * 25
        if extremism_score > 0:
            additional.append(CategoryDetection(
                category=HarmCategory.EXTREMISM,
                detected=extremism_score > 50,
                confidence=min(extremism_score, 100.0),
                evidence=[content[:100]],
                severity=min(extremism_score, 100.0)
            ))
        
        # Scam detection
        scam_keywords = ['click here', 'free money', 'winner', 'claim prize', 'urgent']
        scam_score = sum(1 for kw in scam_keywords if kw in content_lower) * 20
        if scam_score > 0:
            additional.append(CategoryDetection(
                category=HarmCategory.SCAMS,
                detected=scam_score > 50,
                confidence=min(scam_score, 100.0),
                evidence=[content[:100]],
                severity=min(scam_score, 100.0)
            ))
        
        # Misinformation detection (basic)
        misinfo_keywords = ['fake news', 'hoax', 'conspiracy']
        misinfo_score = sum(1 for kw in misinfo_keywords if kw in content_lower) * 30
        if misinfo_score > 0:
            additional.append(CategoryDetection(
                category=HarmCategory.MISINFORMATION,
                detected=misinfo_score > 50,
                confidence=min(misinfo_score, 100.0),
                evidence=[content[:100]],
                severity=min(misinfo_score, 100.0)
            ))
        
        return additional
