const express = require("express");
const router = express.Router();
const Problem = require("../models/Problem");

router.post("/problems", async (req, res) => {
  try {
    const {
      title,
      description,
      timeLimit,
      memoryLimit,
      sampleTestcases,
      hiddenTestcases,
    } = req.body;

    const problem = await Problem.create({
      title,
      description,
      timeLimit,
      memoryLimit,
      sampleTestcases: sampleTestcases || [],
      hiddenTestcases: hiddenTestcases || [],
    });

    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/problems", async (req, res) => {
  const problems = await Problem.find().select("-hiddenTestcases");
  res.json(problems);
});

router.get("/problems/:id", async (req, res) => {
  const problem = await Problem.findById(req.params.id).select(
    "-hiddenTestcases",
  );
  res.json(problem);
});

router.delete("/problems/:id", async (req, res) => {
  await Problem.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
