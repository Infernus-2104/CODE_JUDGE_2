import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

function Problems() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    API.get("/problems").then((res) => setProblems(res.data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Problems</h2>

      {problems.map((problem) => (
        <div key={problem._id}>
          <Link to={`/problem/${problem._id}`}>{problem.title}</Link>
        </div>
      ))}
    </div>
  );
}

export default Problems;
