const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/explain", async (req, res) => {
  try {
    const { code, language, status, error, expectedOutput, userOutput } =
      req.body;

    const prompt = `
You are a competitive programming assistant.

Language: ${language}
Submission Status: ${status}

Code:
${code}

Error:
${error || "None"}

Expected Output:
${expectedOutput || "N/A"}

User Output:
${userOutput || "N/A"}

Explain clearly:
1. Why it failed
2. What mistake was made
3. How to fix it
4. Provide corrected code
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
    );

    const explanation = response.data.candidates[0].content.parts[0].text;

    res.json({ explanation });
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    res.status(500).json({
      error: "AI explanation failed",
      details: err.response?.data || err.message,
    });
  }
});

module.exports = router;
