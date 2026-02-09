const BASE_URL = "http://127.0.0.1:8000";

export async function generateQuestions(text, options) {
  const res = await fetch(`${BASE_URL}/generate-questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, ...options })
  });

  return res.json();
}

export async function downloadFile(questions, format, show_answers) {
  const res = await fetch(`${BASE_URL}/download`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questions, format, show_answers })
  });

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `questions.${format}`;
  a.click();
}
