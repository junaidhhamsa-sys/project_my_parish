from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, security

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login", response_model=schemas.Token)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    if not security.verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    token = security.create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    
    # Audit log
    audit = models.AuditLog(
        user_id=user.id,
        user_name=user.full_name,
        user_role=user.role,
        action="LOGIN",
        resource_type="User",
        resource_id=str(user.id),
        details=f"User {user.email} logged in successfully."
    )
    db.add(audit)
    db.commit()

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "avatar_url": user.avatar_url
        }
    }

@router.post("/register", response_model=schemas.UserResponse)
def register(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered")

    new_user = models.User(
        email=payload.email,
        password_hash=security.get_password_hash(payload.password),
        full_name=payload.full_name,
        phone=payload.phone,
        role=payload.role or "member",
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Also create corresponding Member record
    names = payload.full_name.split(" ", 1)
    fn = names[0]
    ln = names[1] if len(names) > 1 else ""
    mem = models.Member(
        user_id=new_user.id,
        first_name=fn,
        last_name=ln,
        email=new_user.email,
        phone=new_user.phone,
        membership_status="active",
        joined_date="2026-09-25"
    )
    db.add(mem)
    db.commit()

    return new_user

@router.get("/me")
def get_me(token: str = Depends(security.oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        # Fallback default demo user if token is missing in public preview
        user = db.query(models.User).filter(models.User.role == "super_admin").first()
        return user
    
    payload = security.decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(models.User).filter(models.User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
