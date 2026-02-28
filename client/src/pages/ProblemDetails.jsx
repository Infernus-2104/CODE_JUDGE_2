import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";
import EditorComponent from "../components/EditorComponent";
import ReactMarkdown from "react-markdown";

function ProblemDetails() {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [aiExplanation, setAiExplanation] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    API.get(`/problems/${id}`).then((res) => setProblem(res.data));
    fetchHistory();
  }, [id]);

  const fetchHistory = () => {
    API.get(`/submissions/${id}`).then((res) => setHistory(res.data));
  };

  const submitCode = async () => {
    const res = await API.post("/submissions/submit", {
      problemId: id,
      code,
      language,
    });

    setResult(res.data);
    setAiExplanation("");
    fetchHistory();
  };

  const explainWithAI = async () => {
    setLoadingAI(true);

    const res = await API.post("/ai/explain", {
      code,
      language,
      status: result.status,
      error: result.error || "",
      expectedOutput: result.results?.[0]?.expectedOutput || "",
      userOutput: result.results?.[0]?.userOutput || "",
    });

    setAiExplanation(res.data.explanation);
    setLoadingAI(false);
  };

  if (!problem) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div
      style={{
        padding: "30px",
        background: "#0f172a",
        minHeight: "100vh",
        color: "#f1f5f9",
      }}
    >
      <h2>{problem.title}</h2>
      <p style={{ marginBottom: "20px" }}>{problem.description}</p>

      <h4>Sample Testcases</h4>
      {problem.sampleTestcases?.map((t, i) => (
        <div
          key={i}
          style={{
            marginBottom: "15px",
            background: "#1e293b",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          <b>Input:</b>
          <pre>{t.input}</pre>
          <b>Output:</b>
          <pre>{t.output}</pre>
        </div>
      ))}

      <div style={{ marginTop: "20px", marginBottom: "10px" }}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ padding: "5px", marginRight: "10px" }}
        >
          <option value="python">python</option>
          <option value="cpp">cpp</option>
          <option value="java">java</option>
        </select>

        <button onClick={submitCode} style={{ padding: "6px 12px" }}>
          Submit
        </button>
      </div>

      <EditorComponent code={code} setCode={setCode} language={language} />

      {/* ===================== RESULT SECTION ===================== */}

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h3>
            Verdict:{" "}
            <span
              style={{
                color:
                  result.status === "Accepted"
                    ? "#22c55e"
                    : result.status === "Compilation Error"
                      ? "#f87171"
                      : "#facc15",
              }}
            >
              {result.status}
            </span>
          </h3>

          {result.status === "Compilation Error" && (
            <pre
              style={{
                background: "#1e293b",
                padding: "15px",
                borderRadius: "8px",
                color: "#f87171",
                marginTop: "10px",
              }}
            >
              {result.error}
            </pre>
          )}

          {result.status !== "Compilation Error" && (
            <p style={{ marginTop: "10px" }}>Time: {result.executionTime} ms</p>
          )}

          {/* Testcase breakdown */}
          {result.results?.map((r) => (
            <div key={r.testcaseNumber} style={{ marginTop: "10px" }}>
              <p>
                Testcase {r.testcaseNumber}:{" "}
                <b
                  style={{
                    color: r.status === "Passed" ? "#22c55e" : "#f87171",
                  }}
                >
                  {r.status}
                </b>
              </p>

              {r.expectedOutput && (
                <div
                  style={{
                    background: "#1e293b",
                    padding: "10px",
                    borderRadius: "6px",
                  }}
                >
                  <p>
                    <b>Expected Output:</b>
                  </p>
                  <pre>{r.expectedOutput}</pre>
                  <p>
                    <b>Your Output:</b>
                  </p>
                  <pre>{r.userOutput}</pre>
                </div>
              )}
            </div>
          ))}

          {/* AI Button */}
          {result.status !== "Accepted" && (
            <button
              onClick={explainWithAI}
              style={{
                marginTop: "15px",
                padding: "8px 14px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {loadingAI ? "Generating..." : "Explain with AI"}
            </button>
          )}

          {/* AI Explanation */}
          {aiExplanation && (
            <div
              style={{
                marginTop: "20px",
                background: "#1e293b",
                padding: "20px",
                borderRadius: "10px",
                color: "#f1f5f9",
                boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
              }}
            >
              <h3 style={{ marginBottom: "15px", color: "#22d3ee" }}>
                🤖 AI Explanation
              </h3>

              <ReactMarkdown children={aiExplanation} />
            </div>
          )}
        </div>
      )}

      {/* ===================== HISTORY ===================== */}

      <h3 style={{ marginTop: "40px" }}>Submission History</h3>
      {history.map((sub) => (
        <div
          key={sub._id}
          style={{
            background: "#1e293b",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "5px",
          }}
        >
          {sub.status} | {new Date(sub.createdAt).toLocaleString()}
        </div>
      ))}
    </div>
  );
}

export default ProblemDetails;
