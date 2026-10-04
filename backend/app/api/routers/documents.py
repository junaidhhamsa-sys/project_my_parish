from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.get("")
def list_documents(
    category: Optional[str] = None,
    access_level: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Document)
    if category and category != "All":
        query = query.filter(models.Document.category == category)
    if access_level and access_level != "All":
        query = query.filter(models.Document.access_level == access_level)
    if search:
        s = f"%{search}%"
        query = query.filter(models.Document.title.ilike(s) | models.Document.description.ilike(s))

    docs = query.order_by(models.Document.id.desc()).all()
    res = []
    for d in docs:
        res.append({
            "id": d.id,
            "title": d.title,
            "category": d.category,
            "file_path": d.file_path,
            "file_size": d.file_size,
            "file_type": d.file_type,
            "access_level": d.access_level,
            "version": d.version,
            "description": d.description,
            "uploaded_by": d.uploaded_by,
            "created_at": str(d.created_at) if d.created_at else None
        })
    return res

@router.get("/{document_id}/download")
def download_document(document_id: int, db: Session = Depends(get_db)):
    from fastapi import Response
    doc = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    content = f"""================================================================================
                     MY PARISH MY PROUD - COMMUNITY PLATFORM
                             OFFICIAL PARISH DOCUMENT
================================================================================

DOCUMENT TITLE  : {doc.title}
DOCUMENT ID     : DOC-2026-{doc.id:04d}
CATEGORY        : {doc.category}
VERSION         : {doc.version}
ACCESS LEVEL    : {doc.access_level}
FILE SIZE       : {doc.file_size}
UPLOADED BY     : {doc.uploaded_by}
RELEASE DATE    : 2026-09-25

--------------------------------------------------------------------------------
SUMMARY & DESCRIPTION
--------------------------------------------------------------------------------
{doc.description or 'Official parish document for community governance, policy guidance, and parish member records.'}

--------------------------------------------------------------------------------
POLICY & GOVERNANCE CONTENT
--------------------------------------------------------------------------------
1. Purpose & Scope:
   This document represents official policy and operational guidelines approved 
   by St. Jude Parish Council and Community Secretariat.

2. Access & Security Rules:
   - Access Level: {doc.access_level}
   - Document Distribution: Authorized parish members and administration.
   - Audit Status: Logged under Parish Transparency Framework 2026.

3. Inquiries & Administration:
   For questions regarding this document or updates, contact the Secretariat.
   Email: admin@myparishmyproud.org | Phone: +91 98765-0100

================================================================================
              End of Document — My Parish My Proud Management Platform
================================================================================
"""
    
    clean_title = "".join([c if c.isalnum() or c in ("-", "_") else "_" for c in doc.title])
    filename = f"{clean_title}_{doc.version or 'v1'}.txt"

    return Response(
        content=content.encode("utf-8"),
        media_type="text/plain",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )

@router.post("")
def create_document(payload: schemas.DocumentCreate, db: Session = Depends(get_db)):
    doc = models.Document(**payload.dict(), uploaded_by="Parish Secretariat")
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.delete("/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    doc = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}
