"""AI-assisted content improvement"""
import re
from typing import List
from app.models import RewriteResult, HighlightedSpan


class AIAssistant:
    """Provides AI-assisted content correction"""
    
    def __init__(self):
        """Initialize AI assistant"""
        # Replacement patterns for common issues
        self.profanity_replacements = {
            'hate': 'dislike',
            'stupid': 'unwise',
            'idiot': 'person',
            'dumb': 'uninformed',
        }
    
    def rewrite_content(
        self,
        content: str,
        highlights: List[HighlightedSpan],
        target_tone: str = "professional"
    ) -> RewriteResult:
        """
        Generate safe rewrite suggestions
        
        Requirements: 6.1-6.10
        """
        original = content
        rewritten = content
        improvements = []
        
        # Sort highlights by position (reverse to maintain indices)
        sorted_highlights = sorted(highlights, key=lambda h: h.start, reverse=True)
        
        # Replace problematic spans
        for highlight in sorted_highlights:
            replacement = self._generate_replacement(
                highlight.text,
                highlight.category.value,
                target_tone
            )
            
            if replacement != highlight.text:
                rewritten = (
                    rewritten[:highlight.start] +
                    replacement +
                    rewritten[highlight.end:]
                )
                improvements.append(
                    f"Replaced '{highlight.text}' with '{replacement}' "
                    f"({highlight.reason})"
                )
        
        # Apply tone adjustments
        if target_tone == "professional":
            rewritten = self._professionalize_tone(rewritten)
            improvements.append("Adjusted tone to be more professional")
        
        # Calculate risk reduction (simplified)
        risk_reduction = len(improvements) * 15.0
        
        return RewriteResult(
            original_content=original,
            rewritten_content=rewritten,
            improvements=improvements,
            risk_reduction=min(risk_reduction, 100.0)
        )
    
    def _generate_replacement(
        self,
        text: str,
        category: str,
        tone: str
    ) -> str:
        """Generate replacement text for problematic content"""
        text_lower = text.lower()
        
        # Check profanity replacements
        for profane, replacement in self.profanity_replacements.items():
            if profane in text_lower:
                return text_lower.replace(profane, replacement)
        
        # Generic replacements based on category
        if category == "harassment":
            return "[content moderated]"
        elif category == "violence":
            return "[content removed]"
        elif category == "hate_speech":
            return "[inappropriate content]"
        
        return text
    
    def _professionalize_tone(self, content: str) -> str:
        """Convert to professional tone"""
        # Remove excessive punctuation
        content = re.sub(r'!+', '.', content)
        content = re.sub(r'\?+', '?', content)
        
        # Remove all caps
        if content.isupper():
            content = content.capitalize()
        
        # Replace casual phrases
        casual_to_professional = {
            'gonna': 'going to',
            'wanna': 'want to',
            'yeah': 'yes',
            'nope': 'no',
        }
        
        for casual, professional in casual_to_professional.items():
            content = re.sub(
                r'\b' + casual + r'\b',
                professional,
                content,
                flags=re.IGNORECASE
            )
        
        return content
    
    def redact_pii(self, content: str) -> str:
        """
        Redact personally identifiable information
        
        Requirements: 12.4
        """
        # Email addresses
        content = re.sub(
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            '[EMAIL]',
            content
        )
        
        # Phone numbers
        content = re.sub(
            r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
            '[PHONE]',
            content
        )
        
        # SSN
        content = re.sub(
            r'\b\d{3}-\d{2}-\d{4}\b',
            '[SSN]',
            content
        )
        
        # Credit card numbers
        content = re.sub(
            r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',
            '[CARD]',
            content
        )
        
        return content
