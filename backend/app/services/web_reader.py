import requests
from bs4 import BeautifulSoup


def extract_text_from_website(url: str) -> str:
    response = requests.get(
        url,
        headers={"User-Agent": "Mozilla/5.0"},
        timeout=10
    )
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    # Remove junk
    for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
        tag.decompose()

    paragraphs = []

    # Prefer <article> content if available
    article = soup.find("article")
    search_scope = article if article else soup

    for p in search_scope.find_all("p"):
        text = p.get_text(strip=True)
        if text and len(text) > 40:   # avoid menu / ads
            paragraphs.append(text)

    # Join paragraphs with DOUBLE newline (important)
    return "\n\n".join(paragraphs)
