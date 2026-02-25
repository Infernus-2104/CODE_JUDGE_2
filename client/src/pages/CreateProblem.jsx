import { useState } from "react";
import API from "../api";

function CreateProblem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(2000);
  const [memoryLimit, setMemoryLimit] = useState(65536);

  const [sampleTestcases, setSample] = useState([{ input: "", output: "" }]);
  const [hiddenTestcases, setHidden] = useState([{ input: "", output: "" }]);

  const addSample = () =>
    setSample([...sampleTestcases, { input: "", output: "" }]);

  const addHidden = () =>
    setHidden([...hiddenTestcases, { input: "", output: "" }]);

  const createProblem = async () => {
    await API.post("/problems", {
      title,
      description,
      timeLimit,
      memoryLimit,
      sampleTestcases,
      hiddenTestcases,
    });

    alert("Problem Created!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Problem</h2>

      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <textarea
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        placeholder="Time Limit"
        onChange={(e) => setTimeLimit(e.target.value)}
      />
      <input
        type="number"
        placeholder="Memory Limit"
        onChange={(e) => setMemoryLimit(e.target.value)}
      />

      <h3>Sample Testcases</h3>
      {sampleTestcases.map((t, i) => (
        <div key={i}>
          <textarea
            placeholder="Input"
            onChange={(e) => {
              const updated = [...sampleTestcases];
              updated[i].input = e.target.value;
              setSample(updated);
            }}
          />
          <textarea
            placeholder="Output"
            onChange={(e) => {
              const updated = [...sampleTestcases];
              updated[i].output = e.target.value;
              setSample(updated);
            }}
          />
        </div>
      ))}
      <button onClick={addSample}>Add Sample</button>

      <h3>Hidden Testcases</h3>
      {hiddenTestcases.map((t, i) => (
        <div key={i}>
          <textarea
            placeholder="Input"
            onChange={(e) => {
              const updated = [...hiddenTestcases];
              updated[i].input = e.target.value;
              setHidden(updated);
            }}
          />
          <textarea
            placeholder="Output"
            onChange={(e) => {
              const updated = [...hiddenTestcases];
              updated[i].output = e.target.value;
              setHidden(updated);
            }}
          />
        </div>
      ))}
      <button onClick={addHidden}>Add Hidden</button>

      <button onClick={createProblem}>Create</button>
    </div>
  );
}

export default CreateProblem;
