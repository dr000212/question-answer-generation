from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from pathlib import Path
import shutil
from pydantic import BaseModel
from app.api.schemas import QuestionRequest
from app.services.orchestrator import generate_questions_ai_driven
from app.utils.chunker import chunk_text
from app.services.pdf_reader import extract_text_from_pdf
from app.services.web_reader import extract_text_from_website
from app.services.exporter import export_to_pdf, export_to_txt
from app.api.schemas import DownloadRequest

router = APIRouter()

# -----------------------------
# Temp directory for uploads
# -----------------------------
TEMP_DIR = Path("app/data/temp")
TEMP_DIR.mkdir(parents=True, exist_ok=True)



# -----------------------------
# Simple schemas for upload
# -----------------------------
class UrlRequest(BaseModel):
    url: str


class ChunkRequest(BaseModel):
    text: str


# -----------------------------
# Upload PDF
# -----------------------------
@router.post("/upload/pdf")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = TEMP_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(str(file_path))

    return {
        "type": "pdf",
        "filename": file.filename,
        "text_preview": text[:500],
        "full_text_length": len(text),
        "full_text": text
    }


# -----------------------------
# Upload Website URL
# -----------------------------
@router.post("/upload/url")
async def upload_url(data: UrlRequest):
    try:
        url = data.url.strip()
        text = extract_text_from_website(url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "type": "url",
        "url": url,
        "text_preview": text[:500],
        "full_text_length": len(text),
        "full_text": text
    }


# -----------------------------
# Test chunking (debug endpoint)
# -----------------------------
@router.post("/chunk")
async def test_chunking(data: ChunkRequest):
    text = data.text.strip()

    if not text:
        raise HTTPException(status_code=400, detail="Text is empty")

    chunks = chunk_text(text)

    return {
        "total_chunks": len(chunks),
        "preview_first_chunk": chunks[0][:300] if chunks else ""
    }

@router.post("/generate-questions")
async def generate_questions(data: QuestionRequest):
    text = data.text.strip()

    if not text:
        raise HTTPException(status_code=400, detail="Text is empty")

    chunks = chunk_text(text)

    if not chunks:
        raise HTTPException(status_code=400, detail="No chunks generated")

    questions = generate_questions_ai_driven(
        chunks=chunks,
        question_type=data.question_type,
        difficulty=data.difficulty,
        age_level=data.age_level,
        total_questions=data.total_questions
    )

    return {
        "question_type": data.question_type,
        "difficulty": data.difficulty,
        "age_level": data.age_level,
        "requested_questions": data.total_questions,
        "generated_questions": len(
            questions.get(data.question_type, [])
        ),
        "questions": questions
    }

# -----------------------------
# Download questions (PDF / TXT)
# -----------------------------
@router.post("/download")
async def download_questions(data: DownloadRequest):

    questions = [q.model_dump() for q in data.questions]

    if data.format == "txt":
        file_buffer = export_to_txt(questions, data.show_answers)
        filename = "questions.txt"
        media_type = "text/plain"
    else:
        file_buffer = export_to_pdf(questions, data.show_answers)
        filename = "questions.pdf"
        media_type = "application/pdf"

    return StreamingResponse(
        file_buffer,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
