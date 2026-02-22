// Displays formatted results
document.addEventListener("DOMContentLoaded", () => {
  const reportEl = document.getElementById("analysis-report");
  const dateEl = document.getElementById("analysis-date");
  const downloadBtn = document.getElementById("download-report");

  if (!reportEl) {
    console.error("Report element not found.");
    return;
  }

  const stored = sessionStorage.getItem("latestAnalysis");

  if (!stored) {
    reportEl.textContent =
      "No analysis data found. Please analyze a resume first.";
    if (dateEl) dateEl.textContent = "";
    if (downloadBtn) downloadBtn.disabled = true;
    return;
  }

  let data;
  try {
    data = JSON.parse(stored);
  } catch (err) {
    console.error("Error parsing stored analysis:", err);
    reportEl.textContent =
      "Corrupted analysis data. Please re-analyze your resume.";
    if (dateEl) dateEl.textContent = "";
    if (downloadBtn) downloadBtn.disabled = true;
    return;
  }

  if (dateEl) dateEl.textContent = new Date().toLocaleString();

  const list = (arr) =>
    arr && Array.isArray(arr) && arr.length
      ? arr.map((item) => `• ${item}`).join("\n")
      : "• None";

  const reportText = `
Resume Analysis Report
=====================

Overall Score
${data.overallScore ?? "N/A"} / 100

Score Title
${data.scoreTitle ?? "N/A"}

Score Description
${data.scoreDescription ?? "N/A"}

Technical Skills
${list(data.technicalSkills)}

Soft Skills
${list(data.softSkills)}

Recommendations
${list(data.recommendations)}

Missing Skills
${list(data.missingSkills)}
`.trim();

  reportEl.textContent = reportText;

  // PDF Download
  if (downloadBtn) {
    downloadBtn.addEventListener("click", async () => {
      try {
        if (!window.html2pdf) {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
          document.body.appendChild(script);
          await new Promise((resolve) => (script.onload = resolve));
        }

        const opt = {
          margin: 0.5,
          filename: "resume-analysis-report.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };

        html2pdf().set(opt).from(reportEl).save();
      } catch (err) {
        console.error("PDF download failed:", err);
        alert("Failed to download PDF. Please try again.");
      }
    });
  }
});
