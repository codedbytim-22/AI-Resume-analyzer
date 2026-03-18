const GEMINI_API_KEY = " AIzaSyCj_IKM2cBM4e46_PH4d6AkJpqa3EV4gRQ";

export async function generateResumeAnalysis(resumeText) {
  const prompt = `
You are an experienced recruiter evaluating resumes for students and entry-level candidates across all professional fields (business, tech, healthcare, arts, engineering, etc.).

Your evaluation must be realistic but fair for early-career applicants.

Important evaluation rules:
- Do NOT penalize heavily for lack of full-time experience.
- Consider internships, academic projects, coursework, volunteer work, certifications, and leadership roles as valid experience.
- Focus on clarity, structure, relevance, professionalism, and potential.
- Reward measurable achievements when present.

Score from 0 to 100 using this rough scale:
90–100 = Excellent student/entry-level resume
75–89 = Strong with minor improvements needed
60–74 = Average, needs improvement
40–59 = Weak structure or missing key sections
Below 40 = Very underdeveloped

Return ONLY valid JSON in this exact format:

{
  "overallScore": number,
  "scoreTitle": "short summary title",
  "scoreDescription": "3–5 detailed paragraphs explaining strengths, weaknesses, and potential",
  "technicalSkills": ["list extracted technical or field-specific skills"],
  "softSkills": ["list extracted soft skills"],
  "recommendations": [
    "clear actionable improvement 1",
    "clear actionable improvement 2",
    "clear actionable improvement 3",
    "clear actionable improvement 4",
    "clear actionable improvement 5"
  ],
  "missingSkills": ["important skills missing for this candidate's field"]
}

Rules:
- Do not include markdown.
- Do not include explanations outside JSON.
- If a section truly has no items, explain clearly in scoreDescription and return an empty array.
- Be specific. Avoid generic advice.

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
