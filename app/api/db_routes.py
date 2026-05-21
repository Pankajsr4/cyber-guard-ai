"""Database viewer API routes"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db, User, ModerationLog, FlaggedContent

db_router = APIRouter()


@db_router.get("/users")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "is_active": u.is_active,
            "analyses_count": u.analyses_count,
            "created_at": str(u.created_at),
        }
        for u in users
    ]


@db_router.get("/moderation-logs")
def get_moderation_logs(db: Session = Depends(get_db)):
    logs = db.query(ModerationLog).order_by(ModerationLog.created_at.desc()).all()
    return [
        {
            "id": l.id,
            "content": l.content[:100] + "..." if len(l.content) > 100 else l.content,
            "risk_score": l.risk_score,
            "decision": l.decision,
            "toxicity_score": l.toxicity_score,
            "sentiment": l.sentiment,
            "language": l.language,
            "processing_time_ms": l.processing_time_ms,
            "created_at": str(l.created_at),
        }
        for l in logs
    ]


@db_router.get("/flagged-content")
def get_flagged_content(db: Session = Depends(get_db)):
    items = db.query(FlaggedContent).all()
    return [
        {
            "id": f.id,
            "content_preview": f.content_preview,
            "risk_score": f.risk_score,
            "flag_reason": f.flag_reason,
            "status": f.status,
            "created_at": str(f.created_at),
        }
        for f in items
    ]


@db_router.post("/report")
def submit_report(payload: dict, db: Session = Depends(get_db)):
    """Anonymous user report - sends content to admin review queue"""
    item = FlaggedContent(
        content_preview=payload.get("content", "")[:500],
        risk_score=payload.get("risk_score", 0),
        flag_reason=payload.get("reason", "User reported content"),
        status="pending",
    )
    db.add(item)
    db.commit()
    return {"success": True, "message": "Report submitted successfully"}


@db_router.post("/report/{report_id}/resolve")
def resolve_report(report_id: int, payload: dict, db: Session = Depends(get_db)):
    """Admin marks a report as reviewed or resolved"""
    from datetime import datetime
    item = db.query(FlaggedContent).filter(FlaggedContent.id == report_id).first()
    if not item:
        return {"success": False, "message": "Report not found"}
    item.status = payload.get("status", "reviewed")
    item.reviewed_at = datetime.utcnow()
    db.commit()
    return {"success": True, "message": f"Report marked as {item.status}"}


@db_router.get("/stats")
def get_db_stats(db: Session = Depends(get_db)):
    return {
        "total_users": db.query(User).count(),
        "total_analyses": db.query(ModerationLog).count(),
        "flagged_content": db.query(FlaggedContent).count(),
        "blocked_content": db.query(ModerationLog).filter(ModerationLog.decision == "block").count(),
        "allowed_content": db.query(ModerationLog).filter(ModerationLog.decision == "allow").count(),
    }
