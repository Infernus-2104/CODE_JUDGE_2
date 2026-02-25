const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const Problem = require("../models/Problem");
const Submission = require("../models/Submission");

function normalize(str) {
  return str.trim().replace(/\r\n/g, "\n");
}

// Run program
function execute(command, input, timeLimit) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const process = exec(
      command,
      { timeout: timeLimit },
      (err, stdout, stderr) => {
        const end = Date.now();
        const executionTime = end - start;

        if (err && err.killed) {
          return reject({ type: "TLE" });
        }

        if (err) {
          return reject({ type: "Runtime Error", error: stderr });
        }

        resolve({
          output: stdout,
          executionTime,
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

    // ========================
    // 🐍 PYTHON
    // ========================
    if (language === "python") {
      filePath = path.join(tempDir, "solution.py");
      fs.writeFileSync(filePath, code);

      runCommand = `python "${filePath}"`;

      // Check syntax first
      try {
        await new Promise((resolve, reject) => {
          exec(`python -m py_compile "${filePath}"`, (err, stdout, stderr) => {
            if (err) return reject(stderr);
            resolve();
          });
        });
      } catch (compileError) {
        return res.json({
          status: "Compilation Error",
          error: compileError,
        });
      }
    }

    // ========================
    // 💻 C++
    // ========================
    else if (language === "cpp") {
      filePath = path.join(tempDir, "solution.cpp");
      fs.writeFileSync(filePath, code);

      try {
        await new Promise((resolve, reject) => {
          exec(
            `g++ "${filePath}" -o "${tempDir}/solution"`,
            (err, stdout, stderr) => {
              if (err) return reject(stderr);
              resolve();
            },
          );
        });
      } catch (compileError) {
        return res.json({
          status: "Compilation Error",
          error: compileError,
        });
      }

      runCommand = `"${tempDir}/solution"`;
    }

    // ========================
    // ☕ JAVA
    // ========================
    else if (language === "java") {
      filePath = path.join(tempDir, "Solution.java");
      fs.writeFileSync(filePath, code);

      try {
        await new Promise((resolve, reject) => {
          exec(`javac "${filePath}"`, (err, stdout, stderr) => {
            if (err) return reject(stderr);
            resolve();
          });
        });
      } catch (compileError) {
        return res.json({
          status: "Compilation Error",
          error: compileError,
        });
      }

      runCommand = `java -cp "${tempDir}" Solution`;
    } else {
      return res.json({ status: "Unsupported Language" });
    }

    // ========================
    // RUN TESTCASES
    // ========================

    let results = [];
    let finalStatus = "Accepted";
    let maxTime = 0;

    for (let i = 0; i < allTestcases.length; i++) {
      const testcase = allTestcases[i];
      const isSample = i < sample.length;

      try {
        const result = await execute(
          runCommand,
          testcase.input,
          problem.timeLimit,
        );

        maxTime = Math.max(maxTime, result.executionTime);

        const expected = normalize(testcase.output);
        const userOutput = normalize(result.output);

        if (expected !== userOutput) {
          finalStatus = "Wrong Answer";

          const responseObj = {
            testcaseNumber: i + 1,
            status: "Wrong Answer",
            time: result.executionTime,
          };

          if (isSample) {
            responseObj.expectedOutput = expected;
            responseObj.userOutput = userOutput;
          }

          results.push(responseObj);
          break;
        }

        results.push({
          testcaseNumber: i + 1,
          status: "Passed",
          time: result.executionTime,
        });
      } catch (err) {
        if (err.type === "TLE") finalStatus = "TLE";
        else finalStatus = "Runtime Error";

        results.push({
          testcaseNumber: i + 1,
          status: finalStatus,
          error: err.error || "",
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

module.exports = router;
