// Handles Resume upload
import { generateResumeAnalysis } from "./firebase-ai.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("upload.js loaded");

  const fileInput = document.getElementById("resumeFile");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const textPreview = document.getElementById("textPreview");
  const btnText = analyzeBtn.querySelector(".btn-text");
  const btnLoader = analyzeBtn.querySelector(".btn-loader");

  if (!fileInput || !analyzeBtn || !textPreview) {
    console.warn("Essential elements missing");
    return;
  }

  let selectedFile = null;
  let isProcessing = false;

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  fileInput.addEventListener("change", () => {
    selectedFile = fileInput.files[0];
    textPreview.innerHTML = selectedFile
      ? `<p>Selected file: <strong>${selectedFile.name}</strong></p>`
      : `<p>No file selected</p>`;
  });

  async function pdfToText(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }
    return text.trim();
  }

  async function docxToText(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const zip = await JSZip.loadAsync(e.target.result);
          const docXml = await zip.file("word/document.xml").async("string");
          const text = docXml
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          resolve(text);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  analyzeBtn.addEventListener("click", async () => {
    if (isProcessing) return;

    if (!selectedFile) {
      alert("Please select a resume first");
      return;
    }

    isProcessing = true;
    analyzeBtn.disabled = true;
    btnText.style.display = "none";
    btnLoader.style.display = "inline";

    textPreview.innerHTML = `<p>Extracting text from <strong>${selectedFile.name}</strong>...</p>`;

    try {
      let resumeText = "";

      if (selectedFile.type === "application/pdf") {
        resumeText = await pdfToText(selectedFile);
      } else if (selectedFile.name.endsWith(".docx")) {
        resumeText = await docxToText(selectedFile);
      } else {
        alert("Unsupported file type. Upload PDF or DOCX.");
        return;
      }

      textPreview.innerHTML += `<p>Resume extracted. Running AI analysis...</p>`;

      const prompt = `
Analyze this resume and return ONLY valid JSON in the following format:
{
  "overallScore": 0-100,
  "scoreTitle": "string",
  "scoreDescription": "string",
  "technicalSkills": ["skill1", "skill2"],
  "softSkills": ["skill1", "skill2"],
  "recommendations": ["rec1", "rec2"],
  "missingSkills": ["skill1", "skill2"]
}

Resume Text:
"""${resumeText}"""
`;

      const aiResponse = await generateResumeAnalysis(prompt);

      if (!aiResponse) throw new Error("Empty AI response");

      const cleaned = aiResponse.replace(/```json|```/g, "").trim();
      let analysisData;

      try {
        analysisData = JSON.parse(cleaned);
      } catch {
        analysisData = {
          overallScore: 0,
          scoreTitle: "Analysis Generated",
          scoreDescription: cleaned,
          technicalSkills: [],
          softSkills: [],
          recommendations: [],
          missingSkills: [],
          rawResponse: cleaned,
        };
      }

      sessionStorage.setItem("latestAnalysis", JSON.stringify(analysisData));
      window.location.href = "results.html";
    } catch (err) {
      console.error(err);
      textPreview.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
    } finally {
      isProcessing = false;
      analyzeBtn.disabled = false;
      btnText.style.display = "inline";
      btnLoader.style.display = "none";
    }
  });
});
