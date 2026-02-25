import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";
import EditorComponent from "../components/EditorComponent";

function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    API.get(`/problems/${id}`).then((res) => setProblem(res.data));
    fetchHistory();
  }, [id]);

  const fetchHistory = () => {
    API.get(`/submissions/${id}`).then((res) => setHistory(res.data));
  };

  const submitCode = async () => {
    const res = await API.post("/submit", {
      problemId: id,
      code,
      language,
    });

    setResult(res.data);
    fetchHistory();
  };

  if (!problem) return <div>Loading...</div>;

  return (
    <div>
      <h2>{problem.title}</h2>
      <p>{problem.description}</p>

      <h4>Sample Testcases</h4>
      {problem.sampleTestcases?.map((t, i) => (
        <div key={i}>
          <b>Input:</b>
          <pre>{t.input}</pre>
          <b>Output:</b>
          <pre>{t.output}</pre>
        </div>
      ))}

      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      <EditorComponent code={code} setCode={setCode} language={language} />

      <button onClick={submitCode}>Submit</button>

      {result && (
        <div>
          <h3>Verdict: {result.status}</h3>
          <p>Time: {result.executionTime} ms</p>
          <p>Memory: {result.memoryUsed} KB</p>

          {result.results?.map((r) => (
            <div key={r.testcaseNumber}>
              Testcase {r.testcaseNumber}: {r.status}
            </div>
          ))}
        </div>
      )}

      <h3>Submission History</h3>
      {history.map((sub) => (
        <div key={sub._id}>
          {sub.status} | {new Date(sub.createdAt).toLocaleString()}
        </div>
      ))}
    </div>
  );
}

export default ProblemDetails;
