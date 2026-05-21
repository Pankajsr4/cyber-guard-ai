"""Toxicity detection module"""
from typing import List, Dict
from detoxify import Detoxify
from app.models import HarmCategory, CategoryDetection


# Multilingual abuse dictionary - maps abusive words to their harm category and severity
MULTILINGUAL_ABUSE_DICT: Dict[str, tuple] = {
    # Hindi / Hinglish insults
    "gadha": (HarmCategory.HARASSMENT, 75),
    "gadhe": (HarmCategory.HARASSMENT, 75),
    "ullu": (HarmCategory.HARASSMENT, 70),
    "ullu ka pattha": (HarmCategory.HARASSMENT, 85),
    "bewakoof": (HarmCategory.HARASSMENT, 70),
    "bakwaas": (HarmCategory.HARASSMENT, 60),
    "chutiya": (HarmCategory.HARASSMENT, 95),
    "bhosdi": (HarmCategory.HARASSMENT, 95),
    "madarchod": (HarmCategory.HARASSMENT, 98),
    "behenchod": (HarmCategory.HARASSMENT, 98),
    "bhenchod": (HarmCategory.HARASSMENT, 98),
    "bhosdike": (HarmCategory.HARASSMENT, 98),
    "choot": (HarmCategory.HARASSMENT, 95),
    "teri maa": (HarmCategory.HARASSMENT, 92),
    "maa ki": (HarmCategory.HARASSMENT, 92),
    "teri maa ki": (HarmCategory.HARASSMENT, 95),
    "saala": (HarmCategory.HARASSMENT, 65),
    "haramzada": (HarmCategory.HARASSMENT, 85),
    "harami": (HarmCategory.HARASSMENT, 80),
    "kamina": (HarmCategory.HARASSMENT, 75),
    "kutta": (HarmCategory.HARASSMENT, 70),
    "kutte": (HarmCategory.HARASSMENT, 70),
    "suar": (HarmCategory.HARASSMENT, 75),
    "randi": (HarmCategory.HARASSMENT, 95),
    "mc": (HarmCategory.HARASSMENT, 90),
    "bc": (HarmCategory.HARASSMENT, 90),
    "bkl": (HarmCategory.HARASSMENT, 85),
    "maa ki": (HarmCategory.HARASSMENT, 90),
    "teri maa": (HarmCategory.HARASSMENT, 90),
    "behen ke": (HarmCategory.HARASSMENT, 90),
    "pagal": (HarmCategory.HARASSMENT, 55),
    "stupid": (HarmCategory.HARASSMENT, 70),
    "idiot": (HarmCategory.HARASSMENT, 75),
    "moron": (HarmCategory.HARASSMENT, 75),
    "loser": (HarmCategory.HARASSMENT, 65),
    # Urdu insults
    "jahil": (HarmCategory.HARASSMENT, 65),
    "badtameez": (HarmCategory.HARASSMENT, 60),
    "zaleel": (HarmCategory.HARASSMENT, 75),
    "ghatiya": (HarmCategory.HARASSMENT, 70),
    "kameena": (HarmCategory.HARASSMENT, 75),
    # Spanish insults
    "idiota": (HarmCategory.HARASSMENT, 75),
    "estupido": (HarmCategory.HARASSMENT, 75),
    "imbecil": (HarmCategory.HARASSMENT, 75),
    "maldito": (HarmCategory.HARASSMENT, 70),
    "pendejo": (HarmCategory.HARASSMENT, 85),
    "cabron": (HarmCategory.HARASSMENT, 85),
    "puta": (HarmCategory.HARASSMENT, 90),
    # French insults
    "connard": (HarmCategory.HARASSMENT, 85),
    "salaud": (HarmCategory.HARASSMENT, 80),
    "imbecile": (HarmCategory.HARASSMENT, 70),
    # German insults
    "dummkopf": (HarmCategory.HARASSMENT, 70),
    "idiot": (HarmCategory.HARASSMENT, 75),
    "arschloch": (HarmCategory.HARASSMENT, 85),
    # Threats (multilingual)
    "maar dunga": (HarmCategory.VIOLENCE, 90),
    "jaan se maar": (HarmCategory.VIOLENCE, 95),
    "tod dunga": (HarmCategory.VIOLENCE, 85),
    "khatam kar dunga": (HarmCategory.VIOLENCE, 90),
    "dekh lena": (HarmCategory.VIOLENCE, 70),
    "chhod nahi": (HarmCategory.VIOLENCE, 75),
}


class ToxicityDetector:
    """Detects toxic and harmful content"""
    
    def __init__(self):
        """Initialize toxicity detector with pre-trained models"""
        self.model = Detoxify('original')
        
        # Map Detoxify categories to our harm categories
        # Note: Detoxify's 'obscene' = offensive/crude language, NOT sexual content
        self.category_mapping = {
            'toxicity': HarmCategory.HARASSMENT,
            'severe_toxicity': HarmCategory.VIOLENCE,
            'obscene': HarmCategory.HARASSMENT,   # crude/offensive language, not sexual
            'threat': HarmCategory.VIOLENCE,
            'insult': HarmCategory.HARASSMENT,
            'identity_hate': HarmCategory.HATE_SPEECH,
        }

        # Minimum confidence threshold to report a detection
        self.detection_threshold = 50.0

        # Sexual content requires explicit keywords - not just Detoxify scores
        self.sexual_keywords = [
            'sex', 'porn', 'nude', 'naked', 'explicit', 'nsfw',
            'genitals', 'intercourse', 'erotic'
        ]
    
    def detect(self, content: str, language: str = "en") -> List[CategoryDetection]:
        """
        Detect harmful content across multiple categories

        Requirements: 1.1-1.5
        """
        detections = []

        # Always run multilingual dictionary check first
        multilingual_detections = self._detect_multilingual(content)
        detections.extend(multilingual_detections)

        # Only run Detoxify for English or unknown languages
        # Detoxify also handles Spanish, French, German reasonably well
        if language in ("en", "unknown", "so", "tl", "af", "es", "fr", "de", "pt", "it"):
            try:
                results = self.model.predict(content)

                category_scores: Dict[HarmCategory, float] = {}
                for key, score in results.items():
                    if key in self.category_mapping:
                        category = self.category_mapping[key]
                        confidence = float(score) * 100
                        if category not in category_scores or confidence > category_scores[category]:
                            category_scores[category] = confidence

                for category, confidence in category_scores.items():
                    # Skip if multilingual already detected this category with higher score
                    existing = next((d for d in detections if d.category == category), None)
                    if existing and existing.confidence >= confidence:
                        continue
                    detected = confidence > self.detection_threshold
                    detections.append(CategoryDetection(
                        category=category,
                        detected=detected,
                        confidence=confidence,
                        evidence=[content[:100]] if detected else [],
                        severity=confidence
                    ))
            except Exception:
                pass

        # Sexual content: only flag if explicit keywords present
        content_lower = content.lower()
        if any(kw in content_lower for kw in self.sexual_keywords):
            detections.append(CategoryDetection(
                category=HarmCategory.SEXUAL_CONTENT,
                detected=True,
                confidence=85.0,
                evidence=[content[:100]],
                severity=85.0
            ))

        detections.extend(self._detect_additional_categories(content))
        return detections

    def _detect_multilingual(self, content: str) -> List[CategoryDetection]:
        """Detect abuse using multilingual keyword dictionary - whole word matching"""
        import re
        content_lower = content.lower()
        category_scores: Dict[HarmCategory, float] = {}

        for keyword, (category, severity) in MULTILINGUAL_ABUSE_DICT.items():
            # Use word boundary matching to avoid false positives
            # e.g. "bc" should not match "because", "kutta" should not match "kuttah"
            if ' ' in keyword:
                # Multi-word phrase: use substring match
                if keyword in content_lower:
                    if category not in category_scores or severity > category_scores[category]:
                        category_scores[category] = float(severity)
            else:
                # Single word: use whole-word boundary match
                pattern = r'\b' + re.escape(keyword) + r'\b'
                if re.search(pattern, content_lower):
                    if category not in category_scores or severity > category_scores[category]:
                        category_scores[category] = float(severity)

        detections = []
        for category, severity in category_scores.items():
            detections.append(CategoryDetection(
                category=category,
                detected=True,
                confidence=severity,
                evidence=[content[:100]],
                severity=severity
            ))
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
