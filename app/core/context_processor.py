"""Context-aware content processing"""
import re
from typing import List, Optional


class ContextProcessor:
    """Handles context-aware content interpretation"""
    
    def __init__(self):
        """Initialize context processor"""
        self.conversation_history: List[str] = []
        self.max_history = 50
    
    def process(self, content: str, context: Optional[List[str]] = None) -> str:
        """
        Process content with context awareness
        
        Requirements: 4.1-4.10
        """
        # Store in conversation history
        if context:
            self.conversation_history = context[-self.max_history:]
        
        # Remove quoted text
        processed = self._remove_quoted_text(content)
        
        # Neutralize code snippets
        processed = self._neutralize_code(processed)
        
        # Segment long content
        if len(processed) > 50000:
            processed = self._segment_content(processed)
        
        return processed
    
    def _remove_quoted_text(self, content: str) -> str:
        """Differentiate and remove quoted text"""
        # Remove text in quotes
        content = re.sub(r'"[^"]*"', '', content)
        content = re.sub(r'\'[^\']*\'', '', content)
        # Remove email-style quotes (> at start of line)
        content = re.sub(r'^>.*$', '', content, flags=re.MULTILINE)
        return content
    
    def _neutralize_code(self, content: str) -> str:
        """Neutralize code snippets from analysis"""
        # Remove code blocks (markdown style)
        content = re.sub(r'```[\s\S]*?```', '[CODE_BLOCK]', content)
        # Remove inline code
        content = re.sub(r'`[^`]*`', '[CODE]', content)
        return content
    
    def _segment_content(self, content: str) -> str:
        """Segment long content while preserving context"""
        # For now, just return first 50000 chars
        # In production, would implement smart segmentation
        return content[:50000]
    
    def track_escalation(self, user_id: str) -> float:
        """
        Track escalation patterns across messages
        
        Requirements: 4.9
        """
        if len(self.conversation_history) < 2:
            return 0.0
        
        # Simple escalation detection: check if recent messages are more hostile
        recent_hostile_count = sum(
            1 for msg in self.conversation_history[-5:]
            if any(word in msg.lower() for word in ['hate', 'stupid', 'idiot'])
        )
        
        return min(recent_hostile_count * 25, 100.0)
    
    def add_to_history(self, content: str):
        """Add content to conversation history"""
        self.conversation_history.append(content)
        if len(self.conversation_history) > self.max_history:
            self.conversation_history.pop(0)
