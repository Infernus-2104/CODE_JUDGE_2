import { useEffect, useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Home() {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = token ? jwtDecode(token).role : null;

  useEffect(() => {
    if (token) {
      API.get("/problems")
        .then((res) => setProblems(res.data))
        .catch(() => alert("Error loading problems"));
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: 40 }}>
      <div style={{ marginBottom: 20 }}>
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            {" | "}
            <Link to="/signup">Signup</Link>
            {" | "}
            <Link to="/admin/login">Admin Login</Link>
          </>
        ) : (
          <>
            <button onClick={logout}>Logout</button>

            {role === "ADMIN" && (
              <>
                {" | "}
                <Link to="/create">Create Problem</Link>
              </>
            )}
          </>
        )}
      </div>

      <h2>Problems</h2>

      {!token && <p>Please login to view problems.</p>}

      {problems.map((problem) => (
        <div key={problem.id} style={{ marginBottom: 10 }}>
          <Link to={`/problem/${problem.id}`}>{problem.title}</Link>
        </div>
      ))}
    </div>
  );
}

export default Home;
