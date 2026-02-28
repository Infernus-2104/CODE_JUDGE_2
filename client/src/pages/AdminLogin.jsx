import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        username,
        password
      });

      const token = res.data.token;
      const decoded = jwtDecode(token);

      if (decoded.role !== "ADMIN") {
        alert("Access denied. Not an admin.");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/create");
    } catch (err) {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Admin Login</h2>

      <input
        placeholder="Admin Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={login}>Login as Admin</button>
    </div>
  );
}

export default AdminLogin;