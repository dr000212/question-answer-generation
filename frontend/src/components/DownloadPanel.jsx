export default function DownloadPanel() {
  return (
    <div className="download-panel">
      <div className="panel-header">
        <h3>Export</h3>
        <p>Download your questions for studying anywhere.</p>
      </div>
      <div className="panel-grid">
        <label className="field">
          <span>Format</span>
          <select defaultValue="csv">
            <option value="csv">CSV</option>
            <option value="pdf">PDF</option>
            <option value="anki">Anki</option>
          </select>
        </label>
        <label className="field">
          <span>Include answers</span>
          <input type="checkbox" defaultChecked />
        </label>
      </div>
      <div className="input-actions">
        <button className="btn primary" type="button">
          Download File
        </button>
      </div>
    </div>
  );
}
