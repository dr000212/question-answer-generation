export default function QuestionList({
  questions,
  showAnswers,
  onToggleAnswers
}) {
  const hasQuestions = Array.isArray(questions) && questions.length > 0;

  return (
    <div className="question-list">
      <div className="panel-header">
        <div className="panel-header-row">
          <div>
            <h3>Preview Questions</h3>
            <p>Review your generated questions below.</p>
          </div>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={showAnswers}
            onChange={(event) => onToggleAnswers(event.target.checked)}
          />
          <span>Show answers</span>
        </label>
      </div>
      {hasQuestions ? (
        <ol className="question-items">
          {questions.map((item, index) => (
            <li key={`${item.question}-${index}`} className="question-item">
              <div className="question-text">{item.question}</div>
              {Array.isArray(item.options) && item.options.length > 0 ? (
                <ul className="question-options">
                  {item.options.map((option, optionIndex) => (
                    <li key={`${option}-${optionIndex}`}>{option}</li>
                  ))}
                </ul>
              ) : null}
              {showAnswers && item.answer ? (
                <div className="question-answer">Answer: {item.answer}</div>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
