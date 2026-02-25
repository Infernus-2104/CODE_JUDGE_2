const express = require("express");
const router = express.Router();
const { exec, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const Problem = require("../models/Problem");
const Submission = require("../models/Submission");

function normalize(str) {
  return str.trim().replace(/\r\n/g, "\n");
}

// ⚠ If on Windows, change this to: const wrappedCommand = command;
function execute(command, input, timeLimit) {
  return new Promise((resolve, reject) => {
    const wrappedCommand = command; // Safe for Windows

    const start = Date.now();

    const process = exec(
      wrappedCommand,
      { timeout: timeLimit },
      (err, stdout, stderr) => {
        const end = Date.now();
        const executionTime = end - start;

        if (err && err.killed) {
          return reject({ type: "TLE" });
        }

        if (err) {
          return reject({ type: "Runtime Error" });
        }

        resolve({
          output: stdout,
          executionTime,
          memoryUsed: 0, // Memory disabled for Windows safety
        });
      },
    );

    process.stdin.write(input);
    process.stdin.end();
  });
}

router.post("/submit", async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.json({ status: "Problem Not Found" });
    }

    const sample = problem.sampleTestcases || [];
    const hidden = problem.hiddenTestcases || [];
    const allTestcases = [...sample, ...hidden];

    if (allTestcases.length === 0) {
      return res.json({ status: "No Testcases Found" });
    }

    const tempDir = path.join(__dirname, "../temp");
    let filePath;
    let runCommand;

    if (language === "python") {
      filePath = path.join(tempDir, "solution.py");
      fs.writeFileSync(filePath, code);
      runCommand = `python "${filePath}"`;
    } else if (language === "cpp") {
      filePath = path.join(tempDir, "solution.cpp");
      fs.writeFileSync(filePath, code);
      execSync(`g++ "${filePath}" -o "${tempDir}/solution"`);
      runCommand = `"${tempDir}/solution"`;
    } else if (language === "java") {
      filePath = path.join(tempDir, "Solution.java");
      fs.writeFileSync(filePath, code);
      execSync(`javac "${filePath}"`);
      runCommand = `java -cp "${tempDir}" Solution`;
    } else {
      return res.json({ status: "Unsupported Language" });
    }

    let results = [];
    let finalStatus = "Accepted";
    let maxTime = 0;

    for (let i = 0; i < allTestcases.length; i++) {
      const testcase = allTestcases[i];

      try {
        const result = await execute(
          runCommand,
          testcase.input,
          problem.timeLimit,
        );

        maxTime = Math.max(maxTime, result.executionTime);

        if (normalize(result.output) !== normalize(testcase.output)) {
          finalStatus = "Wrong Answer";
          results.push({
            testcaseNumber: i + 1,
            status: "Wrong Answer",
            time: result.executionTime,
            memory: 0,
          });
          break;
        }

        results.push({
          testcaseNumber: i + 1,
          status: "Passed",
          time: result.executionTime,
          memory: 0,
        });
      } catch (err) {
        if (err.type === "TLE") finalStatus = "TLE";
        else finalStatus = "Runtime Error";

        results.push({
          testcaseNumber: i + 1,
          status: finalStatus,
          time: 0,
          memory: 0,
        });

        break;
      }
    }

    const submission = await Submission.create({
      problemId,
      language,
      code,
      status: finalStatus,
      executionTime: maxTime,
      memoryUsed: 0,
      results,
    });

    return res.json({
      status: finalStatus,
      submissionId: submission._id,
      executionTime: maxTime,
      results,
    });
  } catch (err) {
    console.error(err);
    return res.json({
      status: "Server Error",
      error: err.message,
    });
  }
});

// Get submission history
router.get("/submissions/:problemId", async (req, res) => {
  const submissions = await Submission.find({
    problemId: req.params.problemId,
  }).sort({ createdAt: -1 });

  res.json(submissions);
});

module.exports = router;
