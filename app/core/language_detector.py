"""Language detection module"""
import langdetect
from typing import Dict
from app.models import LanguageDetection

# Unambiguous Hindi/Hinglish words - these ONLY appear in Hindi/Urdu
HINDI_KEYWORDS = {
    # Grammar words unique to Hindi
    'hai', 'hain', 'nahi', 'kya', 'aur', 'yeh', 'woh', 'tum', 'aap', 'mein',
    'tera', 'teri', 'mera', 'meri', 'uska', 'unka', 'karo', 'karna', 'bhai',
    'yaar', 'ki', 'ka', 'ke', 'ko', 'se', 'ne', 'par', 'maa', 'baap',
    'maar', 'zyada', 'bahut', 'accha', 'bura', 'theek', 'bilkul', 'matlab',
    'kyun', 'kaise', 'kaisa', 'kaisi', 'abhi', 'phir', 'lekin', 'toh',
    'bhi', 'sirf', 'bas', 'jaao', 'jao', 'ruk', 'dekh', 'sun', 'bol',
    # Hindi insults (unambiguous)
    'gadha', 'ullu', 'bewakoof', 'pagal', 'kutta', 'suar', 'harami', 'kamina',
    'saala', 'bakwaas', 'haramzada', 'kutte', 'kamine',
    # Hindi abuse (single words)
    'madarchod', 'behenchod', 'bhenchod', 'bhosdike', 'chutiya', 'choot',
    'bkl', 'mkc', 'randi',
}

# Spanish words - need 2+ matches to avoid false positives
SPANISH_KEYWORDS = {
    'puta', 'madre', 'pendejo', 'cabron', 'chinga', 'mierda', 'idiota',
    'estupido', 'imbecil', 'maldito', 'odio', 'vete', 'cállate',
    'hola', 'adios', 'gracias', 'favor', 'como', 'para', 'muy',
}


class LanguageDetector:
    """Detects language in content"""

    def __init__(self):
        """Initialize language detector"""
        langdetect.DetectorFactory.seed = 0  # For consistent results

    def detect(self, content: str) -> LanguageDetection:
        """
        Detect language in content

        Requirements: 7.1-7.5
        """
        words = set(content.lower().split())

        # Rule 0: Check Spanish keywords first (before Hindi, to avoid "tu" confusion)
        # But only if we have strong Spanish indicators (2+ words), not just 1 common word
        spanish_matches = words & SPANISH_KEYWORDS
        if len(spanish_matches) >= 2:
            return LanguageDetection(
                primary_language="es",
                all_languages={"es": 0.90, "en": 0.10},
                confidence=90.0
            )

        # Rule 1: Short text (≤5 words) - check Hindi dict first, else default English
        if len(words) <= 5:
            hindi_matches = words & HINDI_KEYWORDS
            if hindi_matches:
                return LanguageDetection(
                    primary_language="hi",
                    all_languages={"hi": 0.90, "en": 0.10},
                    confidence=90.0
                )
            # Short English-looking text → just say English
            # Only use langdetect if it has non-ASCII characters
            if all(ord(c) < 128 for c in content):
                return LanguageDetection(
                    primary_language="en",
                    all_languages={"en": 1.0},
                    confidence=95.0
                )

        # Rule 2: Check for Hinglish (Hindi words in Latin script) for longer text
        hindi_matches = words & HINDI_KEYWORDS
        if len(hindi_matches) >= 1:
            return LanguageDetection(
                primary_language="hi",
                all_languages={"hi": 0.85, "en": 0.15},
                confidence=85.0
            )

        # Rule 3: Use langdetect for longer / non-ASCII content
        try:
            primary_lang = langdetect.detect(content)
            lang_probs = langdetect.detect_langs(content)
            all_languages = {
                str(lang).split(':')[0]: float(str(lang).split(':')[1])
                for lang in lang_probs
            }
            confidence = all_languages.get(primary_lang, 0.0) * 100

            # Sanity check: if confidence < 80% and content is ASCII, default to English
            if confidence < 80 and all(ord(c) < 128 for c in content):
                return LanguageDetection(
                    primary_language="en",
                    all_languages={"en": 0.8, primary_lang: 0.2},
                    confidence=80.0
                )

            return LanguageDetection(
                primary_language=primary_lang,
                all_languages=all_languages,
                confidence=confidence
            )
        except Exception:
            return LanguageDetection(
                primary_language="en",
                all_languages={"en": 1.0},
                confidence=50.0
            )

    def is_mixed_language(self, content: str, threshold: float = 0.2) -> bool:
        """Check if content contains mixed languages"""
        detection = self.detect(content)
        return len([v for v in detection.all_languages.values() if v > threshold]) > 1
