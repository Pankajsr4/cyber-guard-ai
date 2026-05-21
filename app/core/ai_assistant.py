"""AI-assisted content improvement"""
import re
from typing import List
from app.models import RewriteResult, HighlightedSpan


class AIAssistant:
    """Provides AI-assisted content correction"""

    def __init__(self):
        # Word-level replacements: abusive → neutral
        self.word_replacements = {
            # Insults → neutral
            'stupid': 'uninformed',
            'idiot': 'person',
            'dumb': 'mistaken',
            'moron': 'individual',
            'loser': 'person',
            'pathetic': 'disappointing',
            'useless': 'unhelpful',
            'worthless': 'ineffective',
            'incompetent': 'inexperienced',
            'fool': 'person',
            'jerk': 'individual',
            'garbage': 'poor quality',
            'trash': 'substandard',
            'terrible': 'unsatisfactory',
            'awful': 'poor',
            'horrible': 'unpleasant',
            'disgusting': 'unacceptable',
            'hate': 'strongly dislike',
            'hated': 'strongly disliked',
            'hates': 'strongly dislikes',
            # Profanity → neutral
            'fuck': '[removed]',
            'fucking': 'very',
            'shit': 'issue',
            'damn': 'very',
            'hell': 'very',
            'ass': 'person',
            'bastard': 'individual',
            'bitch': 'person',
            'crap': 'poor quality',
            # Threats → neutral
            'kill': 'strongly oppose',
            'destroy': 'address',
            'ruin': 'negatively impact',
        }

        # Phrase-level rewrites for common hostile patterns
        self.phrase_rewrites = {
            r"i can'?t believe how (stupid|dumb|useless) you are": "I am disappointed with the level of service",
            r"you are (absolutely|completely|totally) (useless|worthless|incompetent)": "The service did not meet my expectations",
            r"this is the worst .* (ever|i'?ve ever)": "This has been a very unsatisfactory experience",
            r"whoever made this is an? (idiot|moron|fool)": "The design needs significant improvement",
            r"total waste of (money|time)": "This did not provide good value",
            r"i (hate|despise) (this|you|your)": "I am very dissatisfied with",
            r"you should (just )?disappear": "I would prefer less contact",
            r"nobody likes you": "There are concerns about interpersonal communication",
            r"i will never use your service again": "I am reconsidering my use of this service",
            r"your employees are (incompetent|useless|fools|idiots)": "Your staff may benefit from additional training",
        }

        # Tone-specific sentence starters
        self.professional_starters = [
            "I would like to express my concern that",
            "I am writing to inform you that",
            "I wish to bring to your attention that",
        ]

    def rewrite_content(
        self,
        content: str,
        highlights: List[HighlightedSpan],
        target_tone: str = "professional"
    ) -> RewriteResult:
        """Generate safe rewrite suggestions"""
        original = content
        rewritten = content
        improvements = []

        # Step 1: Apply phrase-level rewrites first
        rewritten, phrase_improvements = self._apply_phrase_rewrites(rewritten, target_tone)
        improvements.extend(phrase_improvements)

        # Step 2: Apply word-level replacements
        rewritten, word_improvements = self._apply_word_replacements(rewritten, target_tone)
        improvements.extend(word_improvements)

        # Step 3: Apply tone adjustments
        rewritten = self._apply_tone(rewritten, target_tone)
        if target_tone == "professional":
            improvements.append("Adjusted tone to professional style")
        elif target_tone == "softened":
            improvements.append("Softened the tone of the message")
        elif target_tone == "neutral":
            improvements.append("Neutralized the tone of the message")

        # If nothing changed, provide a generic rewrite
        if rewritten.strip() == original.strip():
            rewritten = self._generic_rewrite(original, target_tone)
            improvements.append("Rephrased content to be more appropriate")

        risk_reduction = min(len(improvements) * 20.0, 100.0)

        return RewriteResult(
            original_content=original,
            rewritten_content=rewritten,
            improvements=improvements,
            risk_reduction=risk_reduction
        )

    def _apply_phrase_rewrites(self, content: str, tone: str):
        """Apply phrase-level pattern rewrites"""
        improvements = []
        result = content
        for pattern, replacement in self.phrase_rewrites.items():
            new = re.sub(pattern, replacement, result, flags=re.IGNORECASE)
            if new != result:
                improvements.append(f"Rephrased hostile expression to constructive language")
                result = new
        return result, improvements

    def _apply_word_replacements(self, content: str, tone: str):
        """Replace abusive words with neutral alternatives"""
        improvements = []
        result = content
        for word, replacement in self.word_replacements.items():
            pattern = r'\b' + re.escape(word) + r'\b'
            new = re.sub(pattern, replacement, result, flags=re.IGNORECASE)
            if new != result:
                improvements.append(f"Replaced '{word}' with '{replacement}'")
                result = new
        return result, improvements

    def _apply_tone(self, content: str, tone: str) -> str:
        """Apply tone-specific adjustments"""
        # Remove excessive punctuation
        content = re.sub(r'!{1,}', '.', content)
        content = re.sub(r'\?{2,}', '?', content)

        # Remove all-caps shouting
        words = content.split()
        words = [w.capitalize() if w.isupper() and len(w) > 2 else w for w in words]
        content = ' '.join(words)

        # Casual → formal
        casual_map = {
            r"\bgonna\b": "going to",
            r"\bwanna\b": "want to",
            r"\bgotta\b": "have to",
            r"\byeah\b": "yes",
            r"\bnope\b": "no",
            r"\bkinda\b": "somewhat",
            r"\bsorta\b": "somewhat",
        }
        for pattern, replacement in casual_map.items():
            content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)

        if tone == "softened":
            # Add softening phrases
            content = re.sub(r'^(I am|I\'m) (very |extremely )?disappointed', 
                           'I feel somewhat disappointed', content, flags=re.IGNORECASE)

        return content

    def _generic_rewrite(self, content: str, tone: str) -> str:
        """Fallback generic rewrite when no patterns match"""
        if tone == "professional":
            return f"I would like to provide feedback regarding the following concern: {content}"
        elif tone == "softened":
            return f"I wanted to share that I have some concerns: {content}"
        else:
            return f"Feedback: {content}"

    def redact_pii(self, content: str) -> str:
        """Redact personally identifiable information"""
        # Credit card numbers (must run BEFORE phone to avoid conflicts)
        content = re.sub(
            r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',
            '[CARD REDACTED]', content
        )
        # Email addresses
        content = re.sub(
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            '[EMAIL REDACTED]', content
        )
        # International phone numbers (+91-XXXXXXXXXX or 10-digit)
        content = re.sub(
            r'(\+?\d{1,3}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3,4}[-.\s]?\d{4,6}',
            '[PHONE REDACTED]', content
        )
        # Indian Aadhaar (XXXX-XXXX-XXXX or XXXXXXXXXXXX)
        content = re.sub(
            r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',
            '[AADHAAR REDACTED]', content
        )
        # Indian PAN (ABCDE1234F)
        content = re.sub(
            r'\b[A-Z]{5}[0-9]{4}[A-Z]\b',
            '[PAN REDACTED]', content
        )
        # SSN (XXX-XX-XXXX)
        content = re.sub(r'\b\d{3}-\d{2}-\d{4}\b', '[SSN REDACTED]', content)
        # Full names after "my name is" / "i am" / "name:"
        content = re.sub(
            r'(?i)(my name is\s+|i am\s+|name\s*:\s*)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)',
            lambda m: m.group(1) + '[NAME REDACTED]', content
        )
        # Standalone proper names (Two capitalized words together - basic heuristic)
        content = re.sub(
            r'\b([A-Z][a-z]{2,})\s+([A-Z][a-z]{2,})\b',
            '[NAME REDACTED]', content
        )
        return content
