// upload.js
console.log("UPLOAD JS LOADED");

import { generateResumeAnalysis } from "./firebase-ai.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("upload.js DOM ready");

  const fileInput = document.getElementById("resumeFile");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const textPreview = document.getElementById("textPreview");
  const btnText = analyzeBtn.querySelector(".btn-text");
  const btnLoader = analyzeBtn.querySelector(".btn-loader");

  if (!fileInput || !analyzeBtn || !textPreview) {
    console.error("Essential elements missing");
    return;
  }

  let selectedFile = null;
  let isProcessing = false;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // PDF.js worker
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  // File selection
  fileInput.addEventListener("change", () => {
    selectedFile = fileInput.files[0];
    if (!selectedFile) {
      textPreview.innerHTML = "<p>No file selected</p>";
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("File exceeds 5MB limit.");
      fileInput.value = "";
      return;
    }

    const isPdf = selectedFile.type === "application/pdf";
    const isDocx = selectedFile.name.toLowerCase().endsWith(".docx");

    if (!isPdf && !isDocx) {
      alert("Unsupported file type. Upload PDF or DOCX.");
      fileInput.value = "";
      return;
    }

    textPreview.innerHTML = `<p>Selected file: <strong>${selectedFile.name}</strong></p>`;
  });

  // PDF to text
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

  // DOCX to text using Mammoth
  async function docxToText(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  // Click handler
  analyzeBtn.addEventListener("click", async () => {
    console.log("BUTTON CLICKED");

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
      } else {
        resumeText = await docxToText(selectedFile);
      }

      if (!resumeText || resumeText.length < 50) {
        throw new Error("Resume extraction failed or file too short.");
      }

      textPreview.innerHTML += `<p>Resume extracted. Running AI analysis...</p>`;

      const aiResponse = await generateResumeAnalysis(resumeText);
      if (!aiResponse) throw new Error("Empty AI response");

      const cleaned = aiResponse.replace(/```json|```/g, "").trim();
      let analysisData;

      try {
        analysisData = JSON.parse(cleaned);
      } catch {
        analysisData = {
          overallScore: 0,
          scoreTitle: "AI Analysis",
          scoreDescription: cleaned,
          technicalSkills: [],
          softSkills: [],
          recommendations: [],
          missingSkills: [],
        };
      }

      sessionStorage.setItem("latestAnalysis", JSON.stringify(analysisData));
      window.location.href = "results.html";
    } catch (err) {
      console.error("Error:", err);
      textPreview.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
    } finally {
      isProcessing = false;
      analyzeBtn.disabled = false;
      btnText.style.display = "inline";
      btnLoader.style.display = "none";
    }
  });
});
