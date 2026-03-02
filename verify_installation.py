"""Verify Cyber-Guard AI installation"""
import sys
import importlib


def check_python_version():
    """Check Python version"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ required")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro}")
    return True


def check_dependencies():
    """Check required dependencies"""
    required = [
        'fastapi',
        'uvicorn',
        'pydantic',
        'detoxify',
        'langdetect',
        'nltk',
    ]
    
    missing = []
    for package in required:
        try:
            importlib.import_module(package)
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} (missing)")
            missing.append(package)
    
    return len(missing) == 0


def check_project_structure():
    """Check project structure"""
    import os
    
    required_paths = [
        'app/main.py',
        'app/config.py',
        'app/models/schemas.py',
        'app/core/language_detector.py',
        'app/core/toxicity_detector.py',
        'app/services/moderation_service.py',
        'requirements.txt',
        'README.md',
    ]
    
    missing = []
    for path in required_paths:
        if os.path.exists(path):
            print(f"✅ {path}")
        else:
            print(f"❌ {path} (missing)")
            missing.append(path)
    
    return len(missing) == 0


def check_nltk_data():
    """Check NLTK data"""
    try:
        import nltk
        try:
            nltk.data.find('tokenizers/punkt')
            print("✅ NLTK punkt data")
        except LookupError:
            print("⚠️  NLTK punkt data (will download on first use)")
        
        try:
            nltk.data.find('corpora/stopwords')
            print("✅ NLTK stopwords data")
        except LookupError:
            print("⚠️  NLTK stopwords data (will download on first use)")
        
        return True
    except ImportError:
        print("❌ NLTK not installed")
        return False


def main():
    """Run all checks"""
    print("🛡️  Cyber-Guard AI Installation Verification")
    print("=" * 50)
    print()
    
    print("Checking Python version...")
    python_ok = check_python_version()
    print()
    
    print("Checking dependencies...")
    deps_ok = check_dependencies()
    print()
    
    print("Checking project structure...")
    structure_ok = check_project_structure()
    print()
    
    print("Checking NLTK data...")
    nltk_ok = check_nltk_data()
    print()
    
    print("=" * 50)
    if python_ok and deps_ok and structure_ok:
        print("✅ Installation verified successfully!")
        print()
        print("Next steps:")
        print("1. Run: python app/main.py")
        print("2. Visit: http://localhost:8000/docs")
        print("3. Try: python examples/basic_usage.py")
        return 0
    else:
        print("❌ Installation incomplete")
        print()
        print("To fix:")
        if not deps_ok:
            print("- Run: pip install -r requirements.txt")
        if not nltk_ok:
            print("- Run: python -c \"import nltk; nltk.download('punkt'); nltk.download('stopwords')\"")
        return 1


if __name__ == "__main__":
    sys.exit(main())
