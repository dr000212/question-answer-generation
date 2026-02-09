import json
import logging
import os
import re
from typing import List, Set
from langchain_openai import ChatOpenAI


def get_llm():
    # This avoids crashing during import time
    return ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.7,
        api_key=os.getenv("OPENAI_API_KEY")
    )


logger = logging.getLogger(__name__)


def _extract_json_object(text: str) -> str | None:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return None
    return match.group(0)


def _parse_questions_json(cleaned: str, question_type: str) -> List[dict]:
    """
    Best-effort parse. Returns list of question dicts or empty list.
    """
    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        extracted = _extract_json_object(cleaned)
        if not extracted:
            return []
        try:
            data = json.loads(extracted)
        except json.JSONDecodeError:
            return []

    if not isinstance(data, dict):
        return []

    questions = data.get(question_type, [])
    if not isinstance(questions, list):
        return []
    return questions


def generate_questions_from_chunk(
    chunk_text: str,
    question_type: str,
    difficulty: str,
    age_level: str,
    max_questions: int,
    existing_questions: Set[str]
) -> List[dict]:
    """
    Generates structured questions from a single chunk.
    Returns ONLY new, non-duplicate questions.
    """

    if question_type == "mcq":
        format_block = f"""{{
  "{question_type}": [
    {{
      "question": "",
      "options": ["", "", "", ""],
      "answer": ""
    }}
  ]
}}"""
    elif question_type == "fill_blank":
        format_block = f"""{{
  "{question_type}": [
    {{
      "question": "",
      "answer": ""
    }}
  ]
}}"""
    else:
        format_block = f"""{{
  "{question_type}": [
    {{
      "question": "",
      "answer": ""
    }}
  ]
}}"""

    prompt = f"""
You are an expert educational content creator.

TASK:
Generate EXACTLY {max_questions} UNIQUE questions.

CONSTRAINTS:
- Question type: {question_type}
- Difficulty: {difficulty}
- Age group: {age_level}
- Do NOT repeat questions
- Base questions ONLY on the content
- Do NOT add explanations
- Respond ONLY in valid JSON
- No markdown
- No numbering
- No extra text

JSON FORMAT (STRICT):
{format_block}

CONTENT:
{chunk_text}
"""

    llm = get_llm()
    try:
        raw_response = llm.invoke(prompt).content
    except Exception:
        logger.exception("LLM invoke failed")
        return []

    # Clean accidental markdown
    cleaned = re.sub(r"```json|```", "", raw_response).strip()

    questions = _parse_questions_json(cleaned, question_type)
    if not questions:
        logger.warning("No questions parsed. Raw response: %s", raw_response[:1000])
        return []

    results = []

    for q in questions:
        q_text = q.get("question", "").strip().lower()
        if q_text and q_text not in existing_questions:
            existing_questions.add(q_text)
            results.append(q)

    return results


def generate_questions_ai_driven(
    chunks: List[str],
    question_type: str,
    difficulty: str,
    age_level: str,
    total_questions: int
) -> dict:

    collected = []
    seen = set()

    for chunk in chunks:
        if len(collected) >= total_questions:
            break

        remaining = total_questions - len(collected)

        questions = generate_questions_from_chunk(
            chunk_text=chunk,
            question_type=question_type,
            difficulty=difficulty,
            age_level=age_level,
            max_questions=remaining,
            existing_questions=seen
        )

        collected.extend(questions)

    return {
        question_type: collected
    }
