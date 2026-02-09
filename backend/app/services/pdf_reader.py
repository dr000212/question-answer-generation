import pdfplumber

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts text from a PDF file and returns it as a single string
    """
    full_text = []

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                full_text.append(text)

    return "\n".join(full_text)
