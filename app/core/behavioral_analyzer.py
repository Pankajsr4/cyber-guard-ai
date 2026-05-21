"""Behavioral and tone analysis module"""
from typing import Dict
from app.models import Sentiment, BehavioralAnalysis


class BehavioralAnalyzer:
    """Analyzes behavioral patterns and tone"""
    
    def __init__(self):
        """Initialize behavioral analyzer"""
        self.sarcasm_indicators = [
            'yeah right', 'sure', 'obviously', 'totally', 'oh great',
            'wow thanks', 'how wonderful', 'big surprise', 'shocking'
        ]
        self.passive_aggressive_indicators = [
            'fine', 'whatever', 'if you say so', 'used to being let down',
            'used to being ignored', 'used to being forgotten', 'not like anyone cares',
            'not that it matters', 'not that you care', 'i guess i expected too much',
            'forget it', 'never mind', 'it\'s fine', 'don\'t worry about me',
            'i\'ll be fine', 'as usual', 'typical', 'figures', 'of course not',
            # Spanish passive-aggressive
            'como siempre', 'tipico', 'claro que no', 'para que molestarse',
            'dejame en paz', 'no me importa', 'haz lo que quieras',
            # Hindi passive-aggressive
            'jaane do', 'koi baat nahi', 'theek hai', 'jo bhi ho'
        ]
        self.manipulation_indicators = [
            'you always', 'you never', 'everyone thinks', 'nobody cares',
            'used to being let down', 'used to being hurt', 'always disappoint',
            'you made me', 'because of you', 'your fault', 'you caused',
            'if you really cared', 'if you loved me', 'after everything i did',
            'i do everything', 'i sacrifice', 'you owe me', 'guilt',
            'i expected too much', 'i should have known', 'always happens to me',
            'no one ever', 'no one cares', 'i\'m used to', 'i\'m always',
            'you don\'t care', 'you never listen', 'you always forget',
            'i thought you were different', 'just like everyone else',
            # Spanish manipulation
            'siempre me haces', 'nunca me escuchas', 'por tu culpa',
            'despues de todo lo que hice', 'si me quisieras', 'nadie me quiere',
            # Hindi manipulation
            'tumhari wajah se', 'tum hamesha', 'tum kabhi nahi', 'teri galti hai'
        ]
        self.gaslighting_indicators = [
            'you\'re crazy', 'that never happened', 'you\'re imagining',
            'you\'re too sensitive', 'you\'re overreacting', 'it was just a joke',
            'you always exaggerate', 'no one else has a problem', 'you\'re paranoid',
            'stop being dramatic', 'you misunderstood', 'that\'s not what i said'
        ]
        self.dominance_indicators = [
            'you must', 'you will', 'do as i say', 'you have to',
            'you better', 'or else', 'i\'m warning you', 'do it now'
        ]
        self.hostility_indicators = [
            'hate', 'stupid', 'idiot', 'shut up', 'moron', 'loser',
            'worthless', 'pathetic', 'disgusting', 'trash', 'garbage',
            # Hindi/Hinglish hostility
            'gadha', 'ullu', 'bewakoof', 'pagal', 'kutta', 'suar',
            'kamina', 'harami', 'haramzada', 'saala', 'bakwaas'
        ]
        self.anxiety_indicators = [
            'worried', 'scared', 'anxious', 'nervous', 'terrified',
            'panicking', 'can\'t cope', 'overwhelmed', 'stressed'
        ]
        self.crisis_indicators = [
            'kill myself', 'end it all', 'can\'t go on', 'suicide',
            'want to die', 'no reason to live', 'better off dead'
        ]
    
    def analyze(self, content: str) -> BehavioralAnalysis:
        """
        Perform comprehensive behavioral analysis
        
        Requirements: 3.1-3.10
        """
        content_lower = content.lower()
        
        # Sentiment analysis
        sentiment = self._analyze_sentiment(content_lower)
        
        # Emotion detection
        emotions = self._detect_emotions(content_lower)
        
        # Sarcasm detection
        sarcasm_score = self._detect_pattern(content_lower, self.sarcasm_indicators)
        
        # Passive-aggressive detection
        passive_aggressive_score = self._detect_pattern(
            content_lower,
            self.passive_aggressive_indicators
        )

        # Manipulation detection - passive-aggressive IS manipulation, merge scores
        manipulation_score = self._detect_pattern(content_lower, self.manipulation_indicators)
        manipulation_score = min(max(manipulation_score, passive_aggressive_score), 100.0)
        
        # Gaslighting detection
        gaslighting_score = self._detect_pattern(content_lower, self.gaslighting_indicators)
        
        # Dominance detection
        dominance_score = self._detect_pattern(content_lower, self.dominance_indicators)
        
        # Hostility detection
        hostility_score = self._detect_pattern(content_lower, self.hostility_indicators)
        
        # Anxiety detection
        anxiety_score = self._detect_pattern(content_lower, self.anxiety_indicators)
        
        # Crisis language detection
        crisis_score = self._detect_pattern(content_lower, self.crisis_indicators)
        crisis_detected = crisis_score > 50.0
        
        # Calculate aggression index (same as hostility for now)
        aggression_index = hostility_score
        
        return BehavioralAnalysis(
            sentiment=sentiment,
            emotions=emotions,
            sarcasm_score=sarcasm_score,
            passive_aggressive_score=passive_aggressive_score,
            manipulation_score=manipulation_score,
            gaslighting_score=gaslighting_score,
            dominance_score=dominance_score,
            hostility_score=hostility_score,
            anxiety_score=anxiety_score,
            crisis_language_detected=crisis_detected,
            crisis_confidence=crisis_score,
            aggression_index=aggression_index
        )
    
    def _analyze_sentiment(self, content: str) -> Sentiment:
        """Analyze sentiment (positive, negative, neutral) - multilingual"""
        positive_words = [
            'good', 'great', 'excellent', 'happy', 'love', 'wonderful', 'amazing',
            'fantastic', 'awesome', 'beautiful', 'cheerful', 'joyful', 'excited',
            'delighted', 'pleased', 'glad', 'thankful', 'grateful', 'brilliant',
            'superb', 'perfect', 'enjoy', 'fun', 'nice', 'kind', 'sweet', 'best',
            'positive', 'helpful', 'friendly', 'warm', 'celebrate', 'congratulations',
            # Spanish positive
            'bueno', 'excelente', 'feliz', 'amor', 'maravilloso', 'genial',
            'perfecto', 'gracias', 'bonito', 'alegre', 'contento',
            # Hindi positive
            'accha', 'bahut accha', 'khushi', 'pyaar', 'sundar', 'shukriya'
        ]
        negative_words = [
            'bad', 'terrible', 'awful', 'hate', 'horrible', 'worst', 'angry',
            'furious', 'disgusting', 'stupid', 'idiot', 'ugly', 'pathetic',
            'useless', 'failure', 'trash', 'garbage', 'evil', 'cruel', 'nasty',
            # Spanish negative
            'malo', 'terrible', 'odio', 'horrible', 'estupido', 'idiota',
            'inutil', 'basura', 'maldito', 'dejame', 'no quiero',
            # Hindi negative
            'bura', 'ganda', 'nafrat', 'bewakoof', 'gadha', 'bakwaas'
        ]

        pos_count = sum(1 for word in positive_words if word in content)
        neg_count = sum(1 for word in negative_words if word in content)

        if pos_count > neg_count:
            return Sentiment.POSITIVE
        elif neg_count > pos_count:
            return Sentiment.NEGATIVE
        return Sentiment.NEUTRAL
    
    def _detect_emotions(self, content: str) -> Dict[str, float]:
        """Detect primary emotions"""
        emotions = {
            'anger': self._detect_emotion_anger(content),
            'fear': self._detect_emotion_fear(content),
            'joy': self._detect_emotion_joy(content),
            'sadness': self._detect_emotion_sadness(content),
            'disgust': self._detect_emotion_disgust(content),
            'surprise': self._detect_emotion_surprise(content),
        }
        return emotions
    
    def _detect_emotion_anger(self, content: str) -> float:
        """Detect anger emotion"""
        anger_words = ['angry', 'furious', 'mad', 'rage', 'hate']
        return min(sum(1 for word in anger_words if word in content) * 25, 1.0)
    
    def _detect_emotion_fear(self, content: str) -> float:
        """Detect fear emotion"""
        fear_words = ['scared', 'afraid', 'terrified', 'fear', 'worried']
        return min(sum(1 for word in fear_words if word in content) * 25, 1.0)
    
    def _detect_emotion_joy(self, content: str) -> float:
        """Detect joy emotion"""
        joy_words = ['happy', 'joy', 'excited', 'delighted', 'pleased']
        return min(sum(1 for word in joy_words if word in content) * 25, 1.0)
    
    def _detect_emotion_sadness(self, content: str) -> float:
        """Detect sadness emotion"""
        sadness_words = ['sad', 'depressed', 'unhappy', 'miserable', 'down']
        return min(sum(1 for word in sadness_words if word in content) * 25, 1.0)
    
    def _detect_emotion_disgust(self, content: str) -> float:
        """Detect disgust emotion"""
        disgust_words = ['disgusting', 'gross', 'revolting', 'sick', 'nasty']
        return min(sum(1 for word in disgust_words if word in content) * 25, 1.0)
    
    def _detect_emotion_surprise(self, content: str) -> float:
        """Detect surprise emotion"""
        surprise_words = ['surprised', 'shocked', 'amazed', 'astonished', 'wow']
        return min(sum(1 for word in surprise_words if word in content) * 25, 1.0)
    
    def _detect_pattern(self, content: str, indicators: list) -> float:
        """Detect behavioral pattern based on indicators - capped at 100"""
        matches = sum(1 for indicator in indicators if indicator in content)
        if matches == 0:
            return 0.0
        # Score: 1 match = 33, 2 = 66, 3+ = 100, always capped at 100
        return min(matches * 33.0, 100.0)
