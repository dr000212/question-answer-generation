import { useState } from "react";
import InputBox from "./components/InputBox";
import OptionsPanel from "./components/OptionsPanel";
import QuestionList from "./components/QuestionList";
import DownloadPanel from "./components/DownloadPanel";
import { generateQuestions } from "./services/api";

export default function App() {
  const [text, setText] = useState("");
  const [options, setOptions] = useState({
    question_type: "mcq",
    difficulty: "easy",
    age_level: "14-16",
    total_questions: 3
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const data = await generateQuestions(text, options);
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="container">
      <h1>📘 AI Question Generator</h1>

      <InputBox value={text} onChange={setText} />
      <OptionsPanel options={options} setOptions={setOptions} />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Questions"}
      </button>

      {result && (
        <>
          <QuestionList questions={result.questions} />
          <DownloadPanel questions={result.questions} />
        </>
      )}
    </div>
  );
}
