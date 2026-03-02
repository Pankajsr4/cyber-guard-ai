# 🎤 Audio Analysis Feature - Status & Setup

## ✅ What's Implemented

### Frontend (Complete)
- ✅ Audio recording with microphone access
- ✅ Audio file upload support
- ✅ Audio playback with play/pause controls
- ✅ Volume slider (0-100%)
- ✅ Mute/unmute button
- ✅ Visual recording indicator
- ✅ Automatic transcription + analysis flow
- ✅ Error handling and user feedback

### Backend (Partial)
- ✅ `/transcribe` endpoint created
- ⏳ Speech-to-text integration needed

---

## 🔧 Current Issue

When you click "Analyze Audio", the system:
1. ✅ Sends audio to backend `/transcribe` endpoint
2. ❌ Backend returns "not configured" message
3. ❌ Frontend shows error and switches to Text Input mode

**Root Cause**: The backend doesn't have a speech-to-text service integrated yet.

---

## 🚀 Solution: Install Speech Recognition

### Option 1: Free Google Speech Recognition (Recommended for Testing)

**Step 1**: Install required packages
```bash
pip install SpeechRecognition pydub
```

**Step 2**: Update the `/transcribe` endpoint in `app/api/routes.py`

Replace the current placeholder with:

```python
from fastapi import UploadFile, File
import speech_recognition as sr
import tempfile
import os

@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """Transcribe audio to text using Google Speech Recognition"""
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp_file:
            content = await audio.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        try:
            recognizer = sr.Recognizer()
            
            # Convert and recognize
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
                "message": "Could not understand audio. Please speak clearly."
            }
        except sr.RequestError as e:
            return {
                "transcription": "",
                "success": False,
                "message": f"Speech recognition service error: {str(e)}"
            }
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
```

**Step 3**: Restart the backend
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

### Option 2: OpenAI Whisper (Best Quality, Requires API Key)

**Step 1**: Install OpenAI SDK
```bash
pip install openai
```

**Step 2**: Set API key in `.env`
```env
OPENAI_API_KEY=your_api_key_here
```

**Step 3**: Update `/transcribe` endpoint:

```python
from openai import OpenAI
import os

@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """Transcribe audio using OpenAI Whisper"""
    try:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # Save temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp_file:
            content = await audio.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        try:
            with open(temp_path, 'rb') as audio_file:
                transcription = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file
                )
            
            return {
                "transcription": transcription.text,
                "success": True,
                "message": "Audio transcribed successfully"
            }
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
```

---

### Option 3: Google Cloud Speech-to-Text (Enterprise)

**Step 1**: Install Google Cloud SDK
```bash
pip install google-cloud-speech
```

**Step 2**: Set up credentials
```bash
export GOOGLE_APPLICATION_CREDENTIALS="path/to/credentials.json"
```

**Step 3**: Update endpoint (see Google Cloud documentation)

---

## 🎯 Quick Test After Setup

1. **Restart backend** after installing packages
2. **Go to** http://localhost:3000/analyze
3. **Click** "Audio" tab
4. **Click** "Start Recording"
5. **Say** "fuck you bitch"
6. **Click** "Stop Recording"
7. **Click** "Analyze Audio"
8. **Result**: Should transcribe and show ~98.7% risk score!

---

## 📊 Expected Flow (After Setup)

```
User Records Audio
       ↓
Click "Analyze Audio"
       ↓
Frontend sends audio to /transcribe
       ↓
Backend transcribes: "fuck you bitch"
       ↓
Backend analyzes text
       ↓
Returns risk score: 98.7%
       ↓
Frontend shows report
```

---

## 🐛 Troubleshooting

### Error: "Audio transcription failed"
- **Cause**: Speech recognition packages not installed
- **Fix**: Run `pip install SpeechRecognition pydub`

### Error: "Could not understand audio"
- **Cause**: Audio quality too low or unclear speech
- **Fix**: Speak clearly and closer to microphone

### Error: "Speech recognition service error"
- **Cause**: No internet connection (Google API needs internet)
- **Fix**: Check internet connection or use offline Whisper

### WebM format not supported
- **Cause**: SpeechRecognition needs WAV format
- **Fix**: Install `pydub` and `ffmpeg` for format conversion
  ```bash
  pip install pydub
  # Windows: Download ffmpeg from ffmpeg.org
  # Linux: sudo apt-get install ffmpeg
  # Mac: brew install ffmpeg
  ```

---

## 💡 Recommended Setup for Your Project

**For Development/Testing:**
```bash
pip install SpeechRecognition pydub
```
Then update the `/transcribe` endpoint with Option 1 code above.

**For Production:**
Use OpenAI Whisper (Option 2) for best quality and reliability.

---

## 📝 Summary

**Current Status**: Audio recording works perfectly, but transcription needs backend setup.

**To Fix**: Install `SpeechRecognition` and update the `/transcribe` endpoint.

**Time to Fix**: ~5 minutes

**After Fix**: Full automatic audio analysis will work end-to-end! 🎉

---

**Need help with setup? Let me know which option you want to use!**
