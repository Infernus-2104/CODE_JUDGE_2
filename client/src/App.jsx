import { BrowserRouter, Routes, Route } from "react-router-dom";
import Problems from "./pages/Problems";
import ProblemDetails from "./pages/ProblemDetails";
import CreateProblem from "./pages/CreateProblem";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Problems />} />
        <Route path="/problem/:id" element={<ProblemDetails />} />
        <Route path="/create" element={<CreateProblem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
