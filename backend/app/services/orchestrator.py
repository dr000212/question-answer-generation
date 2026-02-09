from app.services.question_gen import generate_questions_from_chunk


def generate_questions_ai_driven(
    chunks: list[str],
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

        collected.extend(questions[:remaining])
        if len(collected) >= total_questions:
            break

    return {
        question_type: collected
    }
