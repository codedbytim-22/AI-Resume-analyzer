// Handles Resume upload
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

  // File selection
  fileInput.addEventListener("change", () => {
    selectedFile = fileInput.files[0];

    if (!selectedFile) {
      textPreview.innerHTML = "<p>No file selected</p>";
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (
      !allowedTypes.includes(selectedFile.type) &&
      !selectedFile.name.endsWith(".docx")
    ) {
      alert("Unsupported file type. Upload PDF or DOCX.");
      fileInput.value = "";
      selectedFile = null;
      textPreview.innerHTML = "<p>No file selected</p>";
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File too large. Max size is 5MB.");
      fileInput.value = "";
      selectedFile = null;
      textPreview.innerHTML = "<p>No file selected</p>";
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

  // DOCX to text
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

  // Analyze button
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

      textPreview.innerHTML += `<p>Resume extracted successfully.</p>`;

      // Store extracted text in sessionStorage for later analysis
      sessionStorage.setItem("latestResumeText", resumeText);

      alert("Resume text ready for analysis!");
    } catch (err) {
      console.error(err);
      textPreview.innerHTML = `<p style="color:red">Error extracting text: ${err.message}</p>`;
    } finally {
      isProcessing = false;
      analyzeBtn.disabled = false;
      btnText.style.display = "inline";
      btnLoader.style.display = "none";
    }
  });
});
