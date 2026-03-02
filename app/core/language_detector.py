"""Language detection module"""
import langdetect
from typing import Dict
from app.models import LanguageDetection


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
        try:
            # Detect primary language
            primary_lang = langdetect.detect(content)
            
            # Get all language probabilities
            lang_probs = langdetect.detect_langs(content)
            all_languages = {
                str(lang).split(':')[0]: float(str(lang).split(':')[1])
                for lang in lang_probs
            }
            
            # Calculate confidence
            confidence = all_languages.get(primary_lang, 0.0) * 100
            
            return LanguageDetection(
                primary_language=primary_lang,
                all_languages=all_languages,
                confidence=confidence
            )
        except Exception as e:
            # Default to English if detection fails
            return LanguageDetection(
                primary_language="en",
                all_languages={"en": 1.0},
                confidence=50.0
            )
    
    def is_mixed_language(self, content: str, threshold: float = 0.2) -> bool:
        """Check if content contains mixed languages"""
        detection = self.detect(content)
        return len([v for v in detection.all_languages.values() if v > threshold]) > 1
