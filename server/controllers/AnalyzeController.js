import fs from "fs";
import fetch from "node-fetch";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// ✅ Skill extractor
const extractSkills = (text) => {
  const skills = [
    "react", "javascript", "typescript", "html", "css",
    "redux", "node", "express", "mongodb", "sql",
    "aws", "docker", "git", "webpack"
  ];

  const lowerText = text.toLowerCase();
  return skills.filter(skill => lowerText.includes(skill));
};

export const analyzeResume = async (req, res) => {
  try {
    // ✅ File check
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const jobDescription = req.body.jobDescription || "";

    console.log("JOB DESC:", jobDescription);

    // ✅ Read PDF
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    console.log("📄 TEXT:", resumeText.slice(0, 100));

    // ✅ AI API Call
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "AI Resume Analyzer"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `
Analyze resume vs job description.

Return ONLY JSON:

{
  "suggestions": "text"
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`
          }
        ]
      })
    });

    const data = await response.json();
    console.log("🤖 AI RESPONSE:", data);

    // ✅ AI fallback
    let aiSuggestions = "Improve missing skills";

    if (data.choices && data.choices[0]) {
      try {
        const parsed = JSON.parse(data.choices[0].message.content);
        aiSuggestions = parsed.suggestions || aiSuggestions;
      } catch {
        aiSuggestions = data.choices[0].message.content;
      }
    }

    // ✅ ATS LOGIC (NOW CORRECTLY PLACED)
    const resumeSkills = extractSkills(resumeText);
    const jobSkills = extractSkills(jobDescription);

    const matchedSkills = resumeSkills.filter(skill =>
      jobSkills.includes(skill)
    );

    const missingSkills = jobSkills.filter(skill =>
      !resumeSkills.includes(skill)
    );

    // ✅ Scores
    const skillScore = jobSkills.length
      ? (matchedSkills.length / jobSkills.length) * 60
      : 0;

    const keywordScore = jobSkills.length
      ? (matchedSkills.length / jobSkills.length) * 20
      : 0;

    const wordCount = resumeText.split(" ").length;

    let lengthScore = 0;
    if (wordCount > 300 && wordCount < 1000) lengthScore = 10;
    else if (wordCount > 150) lengthScore = 5;

    const aiScore = 5; // simple constant (can improve later)

    const finalScore = Math.round(
      skillScore + keywordScore + lengthScore + aiScore
    );

    // ✅ Clean up file
    fs.unlinkSync(filePath);

    // ✅ Final response
    res.json({
      score: finalScore,
      resumeSkills,
      jobSkills,
      matchedSkills,
      missingSkills,
      suggestions: aiSuggestions
    });

  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({
      error: err.message
    });
  }
};













// import fs from "fs";
// import fetch from "node-fetch";
// import { createRequire } from "module";

// const require = createRequire(import.meta.url);
// const pdfParse = require("pdf-parse");

// export const analyzeResume = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const filePath = req.file.path;
//     const jobDescription = req.body.jobDescription || "";

//     console.log("JOB DESC:", req.body.jobDescription);
// console.log("JOB file:", req.file);

//     const dataBuffer = fs.readFileSync(filePath);
//     const pdfData = await pdfParse(dataBuffer);

//     const resumeText = pdfData.text;

//     console.log("📄 TEXT:", resumeText.slice(0, 100));

//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//         "HTTP-Referer": "http://localhost:5173",
//         "X-Title": "AI Resume Analyzer"
//       },
//       body: JSON.stringify({
//         model: "openai/gpt-3.5-turbo",
//         messages: [
//   {
//     role: "user",
//     content: `
// Analyze the resume and compare with job description.

// Return ONLY valid JSON:

// {
//   "score": number,
//   "resumeSkills": [],
//   "skills": [],
//   "matchedSkills": [],
//   "missingSkills": [],
//   "suggestions": ""
// }

// Resume:
// ${resumeText}

// Job Description:
// ${jobDescription}
// `
//   }
// ]

// //         messages: [
// //           {
// //             role: "user",
// //             content: `
// // Return ONLY valid JSON:

// // {
// //   "score": number,
// //   "skills": ["skill1", "skill2"],
// //   "suggestions": "text"
// // }

// // Resume:
// // ${resumeText}
// // `
// //           }
// //         ]
//       })
//     });

//     const data = await response.json();
//     console.log("🤖 AI RESPONSE:", data);

//     if (!data.choices || !data.choices[0]) {
//       return res.status(500).json({
//         error: "AI API failed",
//         details: data
//       });
//     }

//     let output;

//     try {
//       output = JSON.parse(data.choices[0].message.content);
//     } catch {
//       output = {
//         score: "N/A",
//         skills: [],
//         suggestions: data.choices[0].message.content
//       };
//     }

//     fs.unlinkSync(filePath);

//     res.json(output);

//   } catch (err) {
//     console.error("🔥 ERROR:", err);
//     res.status(500).json({
//       error: err.message
//     });
//   }
// };