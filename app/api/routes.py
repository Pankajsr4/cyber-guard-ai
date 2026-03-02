"""API routes"""
import time
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import List
from app.models import (
    ModerationRequest,
    ModerationResult,
    RewriteRequest,
    RewriteResult,
    BulkModerationRequest,
    BulkModerationResult,
)
from app.services import ModerationService
from app.core import AIAssistant

router = APIRouter()

# Dependency injection
def get_moderation_service() -> ModerationService:
    """Get moderation service instance"""
    return ModerationService()

def get_ai_assistant() -> AIAssistant:
    """Get AI assistant instance"""
    return AIAssistant()


@router.post("/analyze", response_model=ModerationResult)
async def analyze_content(
    request: ModerationRequest,
    service: ModerationService = Depends(get_moderation_service)
):
    """
    Analyze content for harmful patterns and risk
    
    Requirements: 11.1, 11.7
    """
    try:
        result = await service.moderate_content(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze/batch", response_model=BulkModerationResult)
async def analyze_batch(
    request: BulkModerationRequest,
    service: ModerationService = Depends(get_moderation_service)
):
    """
    Batch analyze multiple content items
    
    Requirements: 11.3, 11.8
    """
    try:
        start_time = time.time()
        results = await service.moderate_batch(request.items)
        processing_time = time.time() - start_time
        
        return BulkModerationResult(
            results=results,
            total_processed=len(results),
            processing_time_seconds=processing_time
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/moderate", response_model=ModerationResult)
async def moderate_content(
    request: ModerationRequest,
    service: ModerationService = Depends(get_moderation_service)
):
    """
    Real-time content moderation with action recommendation
    
    Requirements: 15.1-15.7
    """
    try:
        result = await service.moderate_content(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/rewrite", response_model=RewriteResult)
async def rewrite_content(
    request: RewriteRequest,
    service: ModerationService = Depends(get_moderation_service),
    assistant: AIAssistant = Depends(get_ai_assistant)
):
    """
    AI-assisted content rewriting
    
    Requirements: 6.1-6.10
    """
    try:
        # First analyze the content
        mod_request = ModerationRequest(content=request.content)
        mod_result = await service.moderate_content(mod_request)
        
        # Generate rewrite
        rewrite_result = assistant.rewrite_content(
            request.content,
            mod_result.highlighted_spans,
            request.target_tone or "professional"
        )
        
        return rewrite_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/privacy/redact")
async def redact_pii(
    request: dict,
    assistant: AIAssistant = Depends(get_ai_assistant)
):
    """
    Redact personally identifiable information
    
    Requirements: 12.4
    """
    try:
        content = request if isinstance(request, str) else request.get("content", "")
        redacted = assistant.redact_pii(content)
        return {
            "original_length": len(content),
            "redacted_content": redacted
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "CyberGuard AI Moderation Engine"
    }


@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """
    Transcribe audio to text using Google Speech Recognition
    """
    import tempfile
    import os
    
    try:
        # Import speech recognition
        try:
            import speech_recognition as sr
        except ImportError:
            return {
                "transcription": "",
                "success": False,
                "message": "SpeechRecognition not installed. Run: pip install SpeechRecognition"
            }
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp_file:
            content = await audio.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        try:
            recognizer = sr.Recognizer()
            
            # Try to recognize the audio
            try:
                with sr.AudioFile(temp_path) as source:
                    audio_data = recognizer.record(source)
                    text = recognizer.recognize_google(audio_data)
                    
                return {
                    "transcription": text,
                    "success": True,
                    "message": "Audio transcribed successfully"
                }
            except sr.UnknownValueError:
                return {
                    "transcription": "",
                    "success": False,
                    "message": "Could not understand audio. Please speak clearly and try again."
                }
            except sr.RequestError as e:
                return {
                    "transcription": "",
                    "success": False,
                    "message": f"Speech recognition service error: {str(e)}"
                }
            except Exception as e:
                # If AudioFile doesn't work with webm, try converting
                return {
                    "transcription": "",
                    "success": False,
                    "message": f"Audio format not supported. Please use WAV format or install ffmpeg for conversion. Error: {str(e)}"
                }
                
        finally:
            # Clean up temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio transcription failed: {str(e)}")
