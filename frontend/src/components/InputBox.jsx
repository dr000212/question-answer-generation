export default function InputBox({
  url,
  onUrlChange,
  onUrlSubmit,
  onFileChange,
  isLoadingUrl,
  isLoadingPdf,
  fileName,
  error,
  contentSource,
  onClearSource
}) {
  const handleFileInput = (event) => {
    const file = event.target.files?.[0] || null;
    onFileChange(file);
    event.target.value = "";
  };

  return (
    <div className="input-box">
      <div className="input-header">
        <h2>Source Material</h2>
        <p>Paste a website URL or upload a PDF to extract content.</p>
        {contentSource ? (
          <div className="status-pill">Content loaded from {contentSource}</div>
        ) : null}
      </div>
      <label className="field">
        <span>Website URL</span>
        <input
          className="input-textarea"
          placeholder="https://example.com/article"
          value={url}
          onChange={(event) => onUrlChange(event.target.value)}
        />
        <span className="hint">
          Must be a public page. We will extract text from it.
        </span>
        {error ? <span className="hint error-text">{error}</span> : null}
      </label>
      <div className="input-actions spaced">
        <button
          className="btn primary"
          type="button"
          onClick={onUrlSubmit}
          disabled={isLoadingUrl || !url.trim()}
        >
          {isLoadingUrl ? "Loading..." : "Load Website"}
        </button>
        <button className="btn ghost" type="button" onClick={onClearSource}>
          Clear
        </button>
      </div>
      <label className="dropzone" htmlFor="source-file">
        <div className="dropzone-title">
          {isLoadingPdf ? "Uploading..." : "Drop a PDF"}
        </div>
        <div className="dropzone-meta">
          {fileName ? fileName : "Max 10 MB"}
        </div>
        <input
          id="source-file"
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFileInput}
          disabled={isLoadingPdf}
        />
      </label>
    </div>
  );
}
