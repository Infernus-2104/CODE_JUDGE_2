import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{ padding: "10px", background: "#222", color: "white" }}>
      <Link to="/" style={{ marginRight: "20px", color: "white" }}>
        Problems
      </Link>
      <Link to="/create" style={{ color: "white" }}>
        Create Problem
      </Link>
    </div>
  );
}

export default Navbar;
