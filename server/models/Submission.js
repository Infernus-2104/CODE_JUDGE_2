const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  problemId: mongoose.Schema.Types.ObjectId,
  language: String,
  code: String,
  status: String,
  executionTime: Number,
  memoryUsed: Number,
  results: [
    {
      testcaseNumber: Number,
      status: String,
      time: Number,
      memory: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Submission", submissionSchema);
