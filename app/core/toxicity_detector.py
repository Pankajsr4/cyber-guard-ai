"""Toxicity detection module - lightweight version without PyTorch"""
import re
from typing import List, Dict
from app.models import HarmCategory, CategoryDetection

# ── Multilingual abuse dictionary ──────────────────────────────────────────
MULTILINGUAL_ABUSE_DICT: Dict[str, tuple] = {
    # English insults
    "idiot": (HarmCategory.HARASSMENT, 75),
    "stupid": (HarmCategory.HARASSMENT, 70),
    "moron": (HarmCategory.HARASSMENT, 75),
    "loser": (HarmCategory.HARASSMENT, 65),
    "pathetic": (HarmCategory.HARASSMENT, 70),
    "useless": (HarmCategory.HARASSMENT, 65),
    "worthless": (HarmCategory.HARASSMENT, 70),
    "incompetent": (HarmCategory.HARASSMENT, 65),
    "fool": (HarmCategory.HARASSMENT, 60),
    "jerk": (HarmCategory.HARASSMENT, 65),
    "garbage": (HarmCategory.HARASSMENT, 65),
    "trash": (HarmCategory.HARASSMENT, 65),
    "disgusting": (HarmCategory.HARASSMENT, 70),
    # English profanity
    "fuck": (HarmCategory.HARASSMENT, 85),
    "fucking": (HarmCategory.HARASSMENT, 85),
    "shit": (HarmCategory.HARASSMENT, 75),
    "bitch": (HarmCategory.HARASSMENT, 85),
    "bastard": (HarmCategory.HARASSMENT, 80),
    "asshole": (HarmCategory.HARASSMENT, 85),
    "damn": (HarmCategory.HARASSMENT, 50),
    "crap": (HarmCategory.HARASSMENT, 55),
    # English hate speech
    "hate you": (HarmCategory.HARASSMENT, 70),
    "i hate": (HarmCategory.HARASSMENT, 65),
    # English violence/threats
    "kill you": (HarmCategory.VIOLENCE, 95),
    "gonna kill": (HarmCategory.VIOLENCE, 95),
    "i will kill": (HarmCategory.VIOLENCE, 95),
    "murder": (HarmCategory.VIOLENCE, 90),
    "destroy you": (HarmCategory.VIOLENCE, 80),
    "beat you": (HarmCategory.VIOLENCE, 75),
    "hurt you": (HarmCategory.VIOLENCE, 75),
    "i want to kill": (HarmCategory.VIOLENCE, 95),
    # Self harm
    "kill myself": (HarmCategory.SELF_HARM, 95),
    "end my life": (HarmCategory.SELF_HARM, 95),
    "want to die": (HarmCategory.SELF_HARM, 90),
    "suicide": (HarmCategory.SELF_HARM, 90),
    # Hindi / Hinglish insults
    "gadha": (HarmCategory.HARASSMENT, 75),
    "gadhe": (HarmCategory.HARASSMENT, 75),
    "ullu": (HarmCategory.HARASSMENT, 70),
    "bewakoof": (HarmCategory.HARASSMENT, 70),
    "bakwaas": (HarmCategory.HARASSMENT, 60),
    "chutiya": (HarmCategory.HARASSMENT, 95),
    "madarchod": (HarmCategory.HARASSMENT, 98),
    "behenchod": (HarmCategory.HARASSMENT, 98),
    "bhenchod": (HarmCategory.HARASSMENT, 98),
    "bhosdike": (HarmCategory.HARASSMENT, 98),
    "saala": (HarmCategory.HARASSMENT, 65),
    "haramzada": (HarmCategory.HARASSMENT, 85),
    "harami": (HarmCategory.HARASSMENT, 80),
    "kamina": (HarmCategory.HARASSMENT, 75),
    "kutta": (HarmCategory.HARASSMENT, 70),
    "kutte": (HarmCategory.HARASSMENT, 70),
    "suar": (HarmCategory.HARASSMENT, 75),
    "randi": (HarmCategory.HARASSMENT, 95),
    "choot": (HarmCategory.HARASSMENT, 95),
    "teri maa": (HarmCategory.HARASSMENT, 92),
    "maa ki": (HarmCategory.HARASSMENT, 92),
    "teri maa ki": (HarmCategory.HARASSMENT, 95),
    "pagal": (HarmCategory.HARASSMENT, 55),
    "bkl": (HarmCategory.HARASSMENT, 85),
    "mc": (HarmCategory.HARASSMENT, 90),
    "bc": (HarmCategory.HARASSMENT, 90),
    # Hindi threats
    "maar dunga": (HarmCategory.VIOLENCE, 90),
    "jaan se maar": (HarmCategory.VIOLENCE, 95),
    "khatam kar dunga": (HarmCategory.VIOLENCE, 90),
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
    "puto": (HarmCategory.HARASSMENT, 90),
    # French insults
    "connard": (HarmCategory.HARASSMENT, 85),
    "salaud": (HarmCategory.HARASSMENT, 80),
    # German insults
    "dummkopf": (HarmCategory.HARASSMENT, 70),
    "arschloch": (HarmCategory.HARASSMENT, 85),
    # Extremism
    "terrorist": (HarmCategory.EXTREMISM, 85),
    "extremist": (HarmCategory.EXTREMISM, 80),
    # Scams
    "click here": (HarmCategory.SCAMS, 55),
    "free money": (HarmCategory.SCAMS, 70),
    "claim prize": (HarmCategory.SCAMS, 75),
    "winner": (HarmCategory.SCAMS, 50),
}

# Sexual content keywords
SEXUAL_KEYWORDS = [
    'sex', 'porn', 'nude', 'naked', 'explicit', 'nsfw',
    'genitals', 'intercourse', 'erotic'
]


class ToxicityDetector:
    """Detects toxic and harmful content using keyword-based approach"""

    def __init__(self):
        self.detection_threshold = 50.0

    def detect(self, content: str, language: str = "en") -> List[CategoryDetection]:
        """Detect harmful content across multiple categories"""
        detections = []

        # Multilingual dictionary check (whole-word matching)
        multilingual = self._detect_multilingual(content)
        detections.extend(multilingual)

        # Additional heuristic checks
        detections.extend(self._detect_additional_categories(content))

        # Sexual content
        content_lower = content.lower()
        if any(kw in content_lower for kw in SEXUAL_KEYWORDS):
            detections.append(CategoryDetection(
                category=HarmCategory.SEXUAL_CONTENT,
                detected=True,
                confidence=85.0,
                evidence=[content[:100]],
                severity=85.0
            ))

        return detections

    def _detect_multilingual(self, content: str) -> List[CategoryDetection]:
        """Detect abuse using multilingual keyword dictionary with whole-word matching"""
        content_lower = content.lower()
        category_scores: Dict[HarmCategory, float] = {}

        for keyword, (category, severity) in MULTILINGUAL_ABUSE_DICT.items():
            if ' ' in keyword:
                # Multi-word phrase: substring match
                if keyword in content_lower:
                    if category not in category_scores or severity > category_scores[category]:
                        category_scores[category] = float(severity)
            else:
                # Single word: whole-word boundary match
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
        self_harm_keywords = ['suicide', 'kill myself', 'end my life', 'self harm', 'want to die']
        self_harm_score = sum(25 for kw in self_harm_keywords if kw in content_lower)
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
        extremism_score = sum(25 for kw in extremism_keywords if kw in content_lower)
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
        scam_score = sum(20 for kw in scam_keywords if kw in content_lower)
        if scam_score > 0:
            additional.append(CategoryDetection(
                category=HarmCategory.SCAMS,
                detected=scam_score > 50,
                confidence=min(scam_score, 100.0),
                evidence=[content[:100]],
                severity=min(scam_score, 100.0)
            ))

        return additional
