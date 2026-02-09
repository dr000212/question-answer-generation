const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:8000";

async function handleResponse(response) {
  if (response.ok) {
    return response.json();
  }
  let detail = "Request failed";
  try {
    const data = await response.json();
    if (data?.detail) {
      detail = data.detail;
    }
  } catch {
    // ignore parsing errors
  }
  throw new Error(detail);
}

export async function uploadPdf(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/upload/pdf`, {
    method: "POST",
    body: formData
  });

  return handleResponse(response);
}

export async function uploadUrl(url) {
  const response = await fetch(`${API_BASE}/upload/url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url })
  });

  return handleResponse(response);
}

export async function generateQuestions(payload) {
  const response = await fetch(`${API_BASE}/generate-questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
}

export async function downloadQuestions({ questions, format, show_answers }) {
  const response = await fetch(`${API_BASE}/download`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      questions,
      format,
      show_answers
    })
  });

  if (!response.ok) {
    let detail = "Download failed";
    try {
      const data = await response.json();
      if (data?.detail) detail = data.detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }

  const blob = await response.blob();
  return {
    blob,
    contentType: response.headers.get("Content-Type") || "",
    filename:
      response.headers
        .get("Content-Disposition")
        ?.split("filename=")[1]
        ?.replace(/"/g, "") || `questions.${format}`
  };
}

export { API_BASE };
