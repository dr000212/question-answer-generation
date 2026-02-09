import { useState } from "react";
import InputBox from "../components/InputBox.jsx";
import OptionsPanel from "../components/OptionsPanel.jsx";
import QuestionList from "../components/QuestionList.jsx";
import {
  downloadQuestions,
  generateQuestions,
  uploadPdf,
  uploadUrl
} from "../services/api.js";

const DEFAULT_OPTIONS = {
  total_questions: 10,
  difficulty: "medium",
  question_type: "mcq",
  age_level: "14-16"
};

export default function Upload() {
  const [text, setText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [status, setStatus] = useState({
    loadingUrl: false,
    loadingPdf: false,
    generating: false
  });
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [showAnswers, setShowAnswers] = useState(true);
  const [downloadFormat, setDownloadFormat] = useState("pdf");
  const [contentSource, setContentSource] = useState("");

  const handleUrlSubmit = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setError("");
    setStatus((prev) => ({ ...prev, loadingUrl: true }));

    try {
      const response = await uploadUrl(trimmed);
      if (!response.full_text) {
        throw new Error("No text extracted from the URL.");
      }
      setText(response.full_text);
      setContentSource("Website");
    } catch (err) {
      setError(err.message || "URL upload failed.");
    } finally {
      setStatus((prev) => ({ ...prev, loadingUrl: false }));
    }
  };

  const handleFileChange = async (file) => {
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Only PDF files are supported by the backend right now.");
      return;
    }

    setError("");
    setStatus((prev) => ({ ...prev, loadingPdf: true }));
    setFileName(file.name);

    try {
      const response = await uploadPdf(file);
      if (!response.full_text) {
        throw new Error("No text extracted from the PDF.");
      }
      setText(response.full_text);
      setContentSource("PDF");
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setStatus((prev) => ({ ...prev, loadingPdf: false }));
    }
  };

  const handleGenerate = async () => {
    const trimmed = text.trim();

    if (trimmed.length < 50) {
      setError("Text must be at least 50 characters.");
      return;
    }

    setError("");
    setStatus((prev) => ({ ...prev, generating: true }));

    try {
      const response = await generateQuestions({
        text: trimmed,
        question_type: options.question_type,
        total_questions: Number(options.total_questions),
        difficulty: options.difficulty,
        age_level: options.age_level
      });

      const list =
        response?.questions?.[options.question_type] ??
        response?.[options.question_type] ??
        [];

      setQuestions(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || "Failed to generate questions.");
    } finally {
      setStatus((prev) => ({ ...prev, generating: false }));
    }
  };

  const handleClear = () => {
    setText("");
    setQuestions([]);
    setError("");
    setUrl("");
    setFileName("");
    setDownloadFormat("pdf");
    setOptions(DEFAULT_OPTIONS);
    setContentSource("");
    setShowAnswers(true);
  };

  const handleDownload = async () => {
    if (!questions.length) {
      setError("No questions to download.");
      return;
    }

    setError("");
    try {
      const { blob, filename } = await downloadQuestions({
        questions,
        format: downloadFormat,
        show_answers: showAnswers
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Download failed.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">AI Question Generator</div>
        <div className="page-subtitle">
          Create smart practice questions from PDFs, websites
        </div>
        <div className="page-description">
          Generate MCQs, fill-in-the-blanks, or long-answer questions with
          adjustable difficulty and age level.
        </div>
        <div className="page-description">
          Download questions as PDF or TXT, with or without answers.
        </div>
      </div>
      <div className="grid">
        <div className="card">
          <InputBox
            url={url}
            onUrlChange={setUrl}
            onUrlSubmit={handleUrlSubmit}
            onFileChange={handleFileChange}
            isLoadingUrl={status.loadingUrl}
            isLoadingPdf={status.loadingPdf}
            fileName={fileName}
            error={error}
            contentSource={contentSource}
            onClearSource={handleClear}
          />
        </div>
        <div className="card">
          <OptionsPanel options={options} onChange={setOptions} />
        </div>
        <div className="generate-bar">
          {!questions.length ? (
            <button
              className="btn primary"
              type="button"
              onClick={handleGenerate}
              disabled={
                status.loadingUrl || status.loadingPdf || status.generating
              }
            >
              {status.generating ? "Generating..." : "Generate"}
            </button>
          ) : (
            <button
              className="btn primary"
              type="button"
              onClick={handleGenerate}
              disabled={
                status.loadingUrl || status.loadingPdf || status.generating
              }
            >
              {status.generating ? "Re-generating..." : "Re-generate"}
            </button>
          )}
        </div>
        <div className="card">
          <QuestionList
            questions={questions}
            showAnswers={showAnswers}
            onToggleAnswers={setShowAnswers}
          />
        </div>
      </div>
      {error ? <div className="error-banner">{error}</div> : null}
      {questions.length > 0 ? (
        <div className="download-section">
          <div className="download-title">Download</div>
          <div className="download-controls">
            <label className="field">
              <span>Format</span>
              <select
                value={downloadFormat}
                onChange={(event) => setDownloadFormat(event.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="txt">TXT</option>
              </select>
            </label>
            <button className="btn primary" type="button" onClick={handleDownload}>
              Download
            </button>
          </div>
          <div className="download-actions">
            <button className="btn ghost" type="button" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      ) : null}
      <div className="page-footer">
        <a
          className="footer-link"
          href="mailto:pkdeepakraj56@gmail.com"
          aria-label="Email"
        >
          <span className="footer-icon" aria-hidden="true">
            @
          </span>
          Gmail
        </a>
        <a
          className="footer-link"
          href="https://www.linkedin.com/in/deepakkaliannan/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <span className="footer-icon" aria-hidden="true">
            in
          </span>
          LinkedIn
        </a>
      </div>
    </div>
  );
}
