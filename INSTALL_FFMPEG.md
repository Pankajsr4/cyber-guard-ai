# 🎬 Installing FFmpeg for Audio Transcription

## Why FFmpeg?

Browser recordings create WebM format audio files. The SpeechRecognition library needs WAV format. FFmpeg converts between formats automatically.

---

## 🪟 Windows Installation

### Option 1: Chocolatey (Easiest)
```powershell
# Run PowerShell as Administrator
choco install ffmpeg
```

### Option 2: Manual Installation
1. Download from: https://www.gyan.dev/ffmpeg/builds/
2. Download "ffmpeg-release-essentials.zip"
3. Extract to `C:\ffmpeg`
4. Add to PATH:
   - Open "Environment Variables"
   - Edit "Path" variable
   - Add: `C:\ffmpeg\bin`
5. Restart terminal

### Option 3: Winget
```powershell
winget install ffmpeg
```

---

## 🐧 Linux Installation

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ffmpeg
```

### Fedora
```bash
sudo dnf install ffmpeg
```

### Arch Linux
```bash
sudo pacman -S ffmpeg
```

---

## 🍎 macOS Installation

### Homebrew
```bash
brew install ffmpeg
```

---

## ✅ Verify Installation

```bash
ffmpeg -version
```

Should show version information.

---

## 🔄 After Installing FFmpeg

1. **Restart your backend server**:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

2. **Test audio recording**:
   - Go to http://localhost:3000/analyze
   - Click "Audio" tab
   - Record something
   - Click "Analyze Audio"
   - Should now transcribe successfully!

---

## 🚨 If You Don't Want to Install FFmpeg

### Alternative: Use WAV Format

Update the frontend to record in WAV format instead of WebM:

```typescript
// In frontend/app/analyze/page.tsx
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/wav'  // Change from default webm
});
```

**Note**: Not all browsers support WAV recording.

---

## 🎯 Quick Test

After installing ffmpeg and restarting backend:

1. Record: "Hello, this is a test"
2. Click "Analyze Audio"
3. Should transcribe: "hello this is a test"
4. Then analyze the text automatically

---

## 💡 Production Recommendation

For production, use **OpenAI Whisper API** instead:
- No ffmpeg needed
- Better accuracy
- Supports all audio formats
- Handles multiple languages better

See `AUDIO_FEATURE_STATUS.md` for Whisper setup instructions.
