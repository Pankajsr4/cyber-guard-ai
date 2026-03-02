@echo off
REM Cyber-Guard AI Moderation Engine - Quick Start Script (Windows)

echo.
echo 🛡️  Cyber-Guard AI Moderation Engine
echo ====================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install -q --upgrade pip
pip install -q -r requirements.txt

REM Download NLTK data
echo 📚 Downloading NLTK data...
python -c "import nltk; nltk.download('punkt', quiet=True); nltk.download('stopwords', quiet=True)"

REM Create .env if it doesn't exist
if not exist ".env" (
    echo ⚙️  Creating .env file...
    copy .env.example .env
)

REM Start the server
echo.
echo 🚀 Starting Cyber-Guard AI Moderation Engine...
echo 📍 API will be available at: http://localhost:8000
echo 📖 Documentation at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python app\main.py
