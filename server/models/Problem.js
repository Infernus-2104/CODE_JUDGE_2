const mongoose = require("mongoose");

const testcaseSchema = new mongoose.Schema({
  input: String,
  output: String,
});

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  timeLimit: Number, // ms
  memoryLimit: Number, // KB

  sampleTestcases: [testcaseSchema], // visible
  hiddenTestcases: [testcaseSchema], // used for judging
});

module.exports = mongoose.model("Problem", problemSchema);
