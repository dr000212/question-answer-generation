from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import stringWidth


# -----------------------------
# TXT Export
# -----------------------------
def export_to_txt(questions: list[dict], show_answers: bool) -> BytesIO:
    buffer = BytesIO()
    lines = []

    for i, q in enumerate(questions, 1):
        question_text = str(q.get("question", "")).strip()
        answer_text = str(q.get("answer", "")).strip()

        lines.append(f"Q{i}. {question_text}")

        options = q.get("options")
        if options:
            for idx, opt in enumerate(options, 1):
                lines.append(f"   {idx}. {opt}")

        if show_answers:
            lines.append(f"Answer: {answer_text}")

        lines.append("")

    buffer.write("\n".join(lines).encode("utf-8"))
    buffer.seek(0)
    return buffer


# -----------------------------
# PDF Export
# -----------------------------
def export_to_pdf(questions: list[dict], show_answers: bool) -> BytesIO:
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    x = 40
    y = height - 50
    max_width = width - 80

    pdf.setFont("Helvetica", 11)

    def wrap_text(text: str, font_name: str, font_size: int) -> list[str]:
        words = text.split()
        if not words:
            return [""]

        lines: list[str] = []
        current = words[0]
        for word in words[1:]:
            candidate = f"{current} {word}"
            if stringWidth(candidate, font_name, font_size) <= max_width:
                current = candidate
            else:
                lines.append(current)
                current = word
        lines.append(current)
        return lines

    def ensure_space(line_count: int, line_height: int = 14):
        nonlocal y
        needed = line_count * line_height + 10
        if y - needed < 60:
            pdf.showPage()
            pdf.setFont("Helvetica", 11)
            y = height - 50

    for i, q in enumerate(questions, 1):
        question_text = str(q.get("question", "")).strip()
        answer_text = str(q.get("answer", "")).strip()

        question_lines = wrap_text(f"Q{i}. {question_text}", "Helvetica", 11)
        ensure_space(len(question_lines), 16)
        for line in question_lines:
            pdf.drawString(x, y, line)
            y -= 16

        options = q.get("options")
        if options:
            for idx, opt in enumerate(options, 1):
                option_lines = wrap_text(f"{idx}. {opt}", "Helvetica", 11)
                ensure_space(len(option_lines), 14)
                for line in option_lines:
                    pdf.drawString(x + 20, y, line)
                    y -= 14

        if show_answers:
            pdf.setFont("Helvetica-Bold", 10)
            answer_lines = wrap_text(f"Answer: {answer_text}", "Helvetica-Bold", 10)
            ensure_space(len(answer_lines), 14)
            for line in answer_lines:
                pdf.drawString(x, y, line)
                y -= 14
            pdf.setFont("Helvetica", 11)
            y -= 4

        y -= 10

    pdf.save()
    buffer.seek(0)
    return buffer
