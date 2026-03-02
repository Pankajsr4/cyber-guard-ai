# 🚀 Cyber-Guard AI - Complete Startup Guide

## Quick Start Commands

### Option 1: Start Both (Recommended)

Open **TWO** PowerShell/Terminal windows:

**Terminal 1 - Backend:**
```bash
cd C:\Users\ASUS\OneDrive\Desktop\CapeStone
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd C:\Users\ASUS\OneDrive\Desktop\CapeStone\frontend
npm run dev
```

---

### Option 2: Using Batch Files

**Backend:**
```bash
.\run.bat
```

**Frontend:**
```bash
.\start-frontend.bat
```

---

## 🌐 Access URLs

Once both are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

## 📋 Complete Setup (First Time Only)

### 1. Backend Setup

```bash
# Navigate to project root
cd C:\Users\ASUS\OneDrive\Desktop\CapeStone

# Install Python dependencies (if not done)
pip install -r requirements.txt

# Start backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
# Navigate to frontend folder
cd C:\Users\ASUS\OneDrive\Desktop\CapeStone\frontend

# Install Node dependencies (if not done)
npm install

# Start frontend
npm run dev
```

---

## 🎯 Quick Test

### Test Backend
```bash
curl http://localhost:8000/health
```

Or in PowerShell:
```powershell
python -c "import requests; print(requests.get('http://localhost:8000/health').json())"
```

### Test Frontend
Open browser: http://localhost:3000

---

## 🛑 Stop Services

### Stop Backend
Press `Ctrl + C` in the backend terminal

### Stop Frontend
Press `Ctrl + C` in the frontend terminal

---

## 🔄 Restart Services

If you make changes:

**Backend Changes:**
1. Stop backend (`Ctrl + C`)
2. Restart: `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`

**Frontend Changes:**
- Usually auto-reloads
- If not, stop (`Ctrl + C`) and run `npm run dev`

---

## 📦 Full Installation (Clean Setup)

### Backend
```bash
cd C:\Users\ASUS\OneDrive\Desktop\CapeStone

# Create virtual environment (optional)
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd C:\Users\ASUS\OneDrive\Desktop\CapeStone\frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🎨 Features Available

### 1. Landing Page
- http://localhost:3000/

### 2. Content Analysis
- http://localhost:3000/analyze
- Text input
- File upload
- Audio recording (with real-time transcription!)
- Batch processing

### 3. Dashboard
- http://localhost:3000/dashboard
- Analytics and statistics
- Recent analyses
- Risk trends

### 4. Analysis Reports
- http://localhost:3000/report/latest
- Detailed risk scores
- Category breakdown charts
- Behavioral analysis
- Flagged content

### 5. AI Assistant
- http://localhost:3000/assistant
- Content rewriting
- PII redaction
- Tone adjustment

### 6. Settings
- http://localhost:3000/settings
- Theme toggle (light/dark)
- Language selection
- API key generation
- Notification preferences

### 7. Admin Panel
- http://localhost:3000/admin
- User management
- Review queue
- Model configuration

### 8. Authentication
- http://localhost:3000/login
- http://localhost:3000/signup

---

## 🧪 Test the System

### 1. Test Text Analysis
```bash
python test_api.py
```

### 2. Quick Demo
```bash
python quick_demo.py
```

### 3. Test Specific Content
```bash
python -c "import requests; response = requests.post('http://localhost:8000/api/v1/analyze', json={'content': 'fuck you bitch'}); print(response.json())"
```

---

## 🎤 Audio Feature

The audio recording feature now works with **browser-based real-time transcription**!

1. Go to http://localhost:3000/analyze
2. Click "Audio" tab
3. Click "Start Recording"
4. Speak: "fuck you bitch"
5. Watch real-time transcription appear
6. Click "Stop Recording"
7. Click "Analyze Audio"
8. See the report with ~98.7% risk score!

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Kill process if needed
taskkill /PID <PID> /F

# Restart backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### PowerShell Script Execution Error
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Module Not Found Errors
```bash
# Backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

---

## 📊 System Status

### Backend
- ✅ 7 AI Components
- ✅ 6 API Endpoints
- ✅ 50+ Languages
- ✅ 12+ Harm Categories
- ✅ Real-time Analysis (<500ms)
- ✅ Batch Processing (1,000 items)

### Frontend
- ✅ 7 Complete Pages
- ✅ Authentication (Login/Signup)
- ✅ Audio Recording with Real-time Transcription
- ✅ Audio Playback Controls
- ✅ Dashboard with Charts
- ✅ Analysis Reports
- ✅ AI Assistant Tools
- ✅ Admin Panel
- ✅ Settings Management

---

## 🎯 Recommended Workflow

### For Development:
1. Start backend first
2. Wait for "Application startup complete"
3. Start frontend
4. Open http://localhost:3000

### For Testing:
1. Use http://localhost:8000/docs for API testing
2. Use frontend for full user experience
3. Check browser console for errors (F12)

### For Demo:
1. Start both services
2. Go to http://localhost:3000
3. Show landing page
4. Demo audio recording feature
5. Show analysis report
6. Demo AI assistant

---

## 📞 Quick Reference

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend API | http://localhost:8000 | 8000 |
| API Docs | http://localhost:8000/docs | 8000 |
| Health Check | http://localhost:8000/health | 8000 |

---

## 🎉 You're All Set!

Your complete AI content moderation system is ready to use!

**Start Command Summary:**
```bash
# Terminal 1
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# Terminal 2
cd frontend
npm run dev
```

Then visit: **http://localhost:3000** 🚀
