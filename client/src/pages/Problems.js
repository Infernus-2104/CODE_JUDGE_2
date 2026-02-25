import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

function Problems() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    API.get("/problems").then((res) => setProblems(res.data));
  }, []);

  return (
    <div>
      <h2>Problems</h2>
      <Link to="/create">Create Problem</Link>

      {problems.map((problem) => (
        <div key={problem._id}>
          <Link to={`/problem/${problem._id}`}>{problem.title}</Link>
        </div>
      ))}
    </div>
  );
}

export default Problems;
