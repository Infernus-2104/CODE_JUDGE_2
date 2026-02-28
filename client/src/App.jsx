import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProblemDetails from "./pages/ProblemDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import CreateProblem from "./pages/CreateProblem";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problem/:id" element={<ProblemDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/create" element={<CreateProblem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
