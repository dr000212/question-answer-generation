export default function OptionsPanel({ options, onChange }) {
  const update = (key, value) => {
    onChange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="options-panel">
      <div className="panel-header">
        <h3>Generation Options</h3>
        <p>Select the options you want for question generation.</p>
      </div>
      <div className="panel-grid">
        <label className="field">
          <span>Total questions</span>
          <input
            type="number"
            min="1"
            max="50"
            value={options.total_questions}
            onChange={(event) => update("total_questions", event.target.value)}
          />
        </label>
        <label className="field">
          <span>Difficulty</span>
          <select
            value={options.difficulty}
            onChange={(event) => update("difficulty", event.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <label className="field">
          <span>Question type</span>
          <select
            value={options.question_type}
            onChange={(event) => update("question_type", event.target.value)}
          >
            <option value="mcq">Multiple choice</option>
            <option value="fill_blank">Fill in the blank</option>
            <option value="short_answer">Short answer</option>
          </select>
        </label>
        <label className="field">
          <span>Age level</span>
          <select
            value={options.age_level}
            onChange={(event) => update("age_level", event.target.value)}
          >
            <option value="8-10">8-10</option>
            <option value="11-13">11-13</option>
            <option value="14-16">14-16</option>
            <option value="17-20">17-20</option>
          </select>
        </label>
      </div>
    </div>
  );
}
