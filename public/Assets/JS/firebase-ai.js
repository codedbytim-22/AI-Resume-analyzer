const GEMINI_API_KEY = " AIzaSyCj_IKM2cBM4e46_PH4d6AkJpqa3EV4gRQ";

export async function generateResumeAnalysis(resumeText) {
  const prompt = `
You are an experienced recruiter and career advisor evaluating resumes for students and entry-level candidates across all fields (tech, business, healthcare, engineering, arts, etc.).

Your job is to:
1. Evaluate the resume
2. Interpret the candidate's current level and field
3. Provide clear, realistic career direction

Important rules:
- Do NOT penalize heavily for lack of experience.
- Treat academic work, projects, and subjects as valid indicators of potential.
- Focus on clarity, structure, relevance, and growth potential.
- Always provide guidance on what the candidate should do next.

Scoring guide:
90-100 = Excellent student/entry-level resume
75-89 = Strong with minor improvements needed
60-74 = Average, needs improvement
40-59 = Weak structure or missing key sections
Below 40 = Very underdeveloped

Return ONLY valid JSON in this exact format:

{
  "overallScore": number,
  "scoreTitle": "short summary title",
  "scoreDescription": "3-5 detailed paragraphs explaining strengths, weaknesses, and overall assessment",

  "technicalSkills": ["list extracted technical or field-specific skills"],
  "softSkills": ["list extracted soft skills"],

  "careerDirection": [
    "specific job role or field they can realistically pursue",
    "another relevant job role or specialization",
    "another possible direction based on their background"
  ],

  "jobSuggestions": [
    "specific entry-level job they can apply for",
    "another realistic job role",
    "another job aligned with their skills or education"
  ],

  "recommendations": [
    "clear actionable improvement 1",
    "clear actionable improvement 2",
    "clear actionable improvement 3",
    "clear actionable improvement 4",
    "clear actionable improvement 5"
  ],

  "missingSkills": ["important skills missing for this candidate's field"]
}

Strict rules:
- Do not include markdown.
- Do not include explanations outside JSON.
- CareerDirection MUST be tailored to the resume (e.g., nursing → clinical roles, tech → dev roles, business → admin/finance roles).
- JobSuggestions MUST be realistic for the candidate's current level (no senior roles).
- If experience is low, use education, subjects, or interests to guide direction.
- Avoid generic advice.

Resume to analyze:
-------------------
${resumeText}
-------------------
`;
}
