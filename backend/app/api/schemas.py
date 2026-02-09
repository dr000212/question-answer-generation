from pydantic import BaseModel, Field
from typing import List, Optional, Literal


# -----------------------------
# Question generation request
# -----------------------------
class QuestionRequest(BaseModel):
    text: str = Field(min_length=50)
    question_type: Literal["mcq", "fill_blank", "short_answer"]
    total_questions: int = Field(gt=0, le=50)
    difficulty: Literal["easy", "medium", "hard"]
    age_level: Literal["8-10", "11-13", "14-16", "17-20"]


# -----------------------------
# Question model for download
# -----------------------------
class ExportQuestion(BaseModel):
    question: str
    answer: str
    options: Optional[List[str]] = None


# -----------------------------
# Download request
# -----------------------------
class DownloadRequest(BaseModel):
    questions: List[ExportQuestion]
    format: Literal["pdf", "txt"]
    show_answers: bool = False
