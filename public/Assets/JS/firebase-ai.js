const GEMINI_API_KEY = " AIzaSyCj_IKM2cBM4e46_PH4d6AkJpqa3EV4gRQ";

export async function generateResumeAnalysis(resumeText) {
  const prompt = `
You are a senior technical recruiter and ATS evaluator in 2025.

Analyze the following resume thoroughly and return ONLY valid JSON.

Be strict, realistic, and detailed.

Scoring Rules:
- Score from 0 to 100
- Evaluate structure, clarity, measurable impact, formatting, professionalism
- Be critical

Return JSON in this exact structure:

{
  "overallScore": number,
  "scoreTitle": "short summary",
  "scoreDescription": "3-5 detailed paragraphs explaining strengths and weaknesses",
  "technicalSkills": ["skill1", "skill2"],
  "softSkills": ["skill1", "skill2"],
  "recommendations": ["improvement1", "improvement2", "improvement3", "improvement4", "improvement5"],
  "missingSkills": ["skill1", "skill2"]
}

Do not include markdown.
Do not include explanations outside JSON.
Do not leave arrays empty — explain inside description if none found.

Resume to analyze:
-------------------
${resumeText}
-------------------
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Gemini API error");
  }

  return data.candidates[0].content.parts[0].text;
}
