"""Database configuration and models"""
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cyberguard.db")

# SQLite needs check_same_thread=False
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="user")  # user / admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    analyses_count = Column(Integer, default=0)


class ModerationLog(Base):
    __tablename__ = "moderation_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    content = Column(Text, nullable=False)
    content_type = Column(String(50), default="text")  # text / file / batch
    language = Column(String(10), default="en")
    risk_score = Column(Float, default=0.0)
    decision = Column(String(20), default="allow")  # allow / flag / block
    toxicity_score = Column(Float, default=0.0)
    sentiment = Column(String(20), default="neutral")
    flags = Column(JSON, default=list)
    processing_time_ms = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)


class FlaggedContent(Base):
    __tablename__ = "flagged_content"

    id = Column(Integer, primary_key=True, index=True)
    moderation_log_id = Column(Integer, nullable=True)
    content_preview = Column(String(500))
    risk_score = Column(Float)
    flag_reason = Column(String(255))
    status = Column(String(20), default="pending")  # pending / reviewed / resolved
    reviewed_by = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)


def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables and seed initial data"""
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Seed admin user if not exists
        admin = db.query(User).filter(User.email == "kumarpankaj9982@gmail.com").first()
        if not admin:
            admin = User(
                name="Pankaj Kumar",
                email="kumarpankaj9982@gmail.com",
                password_hash="hashed_Pankaj@2003",
                role="admin",
                is_active=True,
                analyses_count=42
            )
            db.add(admin)

        # Seed sample users
        sample_users = [
            User(name="Alice Johnson", email="alice@example.com", password_hash="hashed_pass", role="user", analyses_count=15),
            User(name="Bob Smith", email="bob@example.com", password_hash="hashed_pass", role="user", analyses_count=8),
            User(name="Carol White", email="carol@example.com", password_hash="hashed_pass", role="user", analyses_count=23),
            User(name="David Brown", email="david@example.com", password_hash="hashed_pass", role="user", analyses_count=5),
        ]
        for u in sample_users:
            if not db.query(User).filter(User.email == u.email).first():
                db.add(u)

        # Seed sample moderation logs
        sample_logs = [
            ModerationLog(content="This is a normal message about the weather today.", risk_score=5.2, decision="allow", toxicity_score=0.02, sentiment="neutral", language="en", processing_time_ms=120.5),
            ModerationLog(content="I hate everything about this product!", risk_score=62.4, decision="flag", toxicity_score=0.71, sentiment="negative", language="en", processing_time_ms=145.2),
            ModerationLog(content="Great work everyone, keep it up!", risk_score=3.1, decision="allow", toxicity_score=0.01, sentiment="positive", language="en", processing_time_ms=98.7),
            ModerationLog(content="You are absolutely terrible at your job.", risk_score=78.9, decision="block", toxicity_score=0.89, sentiment="negative", language="en", processing_time_ms=132.1),
            ModerationLog(content="Can someone help me with this math problem?", risk_score=2.5, decision="allow", toxicity_score=0.01, sentiment="neutral", language="en", processing_time_ms=88.3),
        ]
        for log in sample_logs:
            db.add(log)

        # Seed flagged content
        flagged = [
            FlaggedContent(content_preview="I hate everything about this product!", risk_score=62.4, flag_reason="High toxicity detected", status="pending"),
            FlaggedContent(content_preview="You are absolutely terrible at your job.", risk_score=78.9, flag_reason="Harassment detected", status="reviewed"),
        ]
        for f in flagged:
            db.add(f)

        db.commit()
        print("✅ Database initialized with sample data")
    except Exception as e:
        db.rollback()
        print(f"Database seed error: {e}")
    finally:
        db.close()
