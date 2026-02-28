import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function CreateProblem() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/admin/login");
  }

  const decoded = jwtDecode(token);
  if (decoded.role !== "ADMIN") {
    alert("Access denied");
    navigate("/");
  }

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(2000);
  const [memoryLimit, setMemoryLimit] = useState(256);

  const [sampleTestcases, setSampleTestcases] = useState([
    { input: "", output: "" }
  ]);

  const [hiddenTestcases, setHiddenTestcases] = useState([
    { input: "", output: "" }
  ]);

  // Add Sample Testcase
  const addSample = () => {
    setSampleTestcases([...sampleTestcases, { input: "", output: "" }]);
  };

  // Add Hidden Testcase
  const addHidden = () => {
    setHiddenTestcases([...hiddenTestcases, { input: "", output: "" }]);
  };

  // Remove Sample
  const removeSample = (index) => {
    const updated = [...sampleTestcases];
    updated.splice(index, 1);
    setSampleTestcases(updated);
  };

  // Remove Hidden
  const removeHidden = (index) => {
    const updated = [...hiddenTestcases];
    updated.splice(index, 1);
    setHiddenTestcases(updated);
  };

  const updateSample = (index, field, value) => {
    const updated = [...sampleTestcases];
    updated[index][field] = value;
    setSampleTestcases(updated);
  };

  const updateHidden = (index, field, value) => {
    const updated = [...hiddenTestcases];
    updated[index][field] = value;
    setHiddenTestcases(updated);
  };

  const create = async () => {
    try {
      await API.post("/problems/create", {
        title,
        description,
        timeLimit,
        memoryLimit,
        sampleTestcases,
        hiddenTestcases
      });

      alert("Problem created!");
      navigate("/");
    } catch (err) {
      console.log(err.response?.data);
      alert("Error creating problem");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Create Problem</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Time Limit (ms)"
        value={timeLimit}
        onChange={(e) => setTimeLimit(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Memory Limit (MB)"
        value={memoryLimit}
        onChange={(e) => setMemoryLimit(e.target.value)}
      />

      <hr />

      <h3>Sample Testcases (Visible)</h3>

      {sampleTestcases.map((tc, index) => (
        <div key={index} style={{ marginBottom: 20 }}>
          <textarea
            placeholder="Input"
            value={tc.input}
            onChange={(e) =>
              updateSample(index, "input", e.target.value)
            }
          />

          <br />

          <textarea
            placeholder="Output"
            value={tc.output}
            onChange={(e) =>
              updateSample(index, "output", e.target.value)
            }
          />

          <br />

          <button onClick={() => removeSample(index)}>
            Remove
          </button>
        </div>
      ))}

      <button onClick={addSample}>Add Sample Testcase</button>

      <hr />

      <h3>Hidden Testcases (Not Visible)</h3>

      {hiddenTestcases.map((tc, index) => (
        <div key={index} style={{ marginBottom: 20 }}>
          <textarea
            placeholder="Input"
            value={tc.input}
            onChange={(e) =>
              updateHidden(index, "input", e.target.value)
            }
          />

          <br />

          <textarea
            placeholder="Output"
            value={tc.output}
            onChange={(e) =>
              updateHidden(index, "output", e.target.value)
            }
          />

          <br />

          <button onClick={() => removeHidden(index)}>
            Remove
          </button>
        </div>
      ))}

      <button onClick={addHidden}>Add Hidden Testcase</button>

      <hr />

      <button onClick={create}>Create Problem</button>
    </div>
  );
}

export default CreateProblem;