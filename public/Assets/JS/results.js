//Displays Formatted results
document.addEventListener("DOMContentLoaded", () => {
  const reportEl = document.getElementById("analysis-report");
  const dateEl = document.getElementById("analysis-date");
  const downloadBtn = document.getElementById("download-report");

  const stored = sessionStorage.getItem("latestAnalysis");

  if (!stored) {
    reportEl.textContent =
      "No analysis data found. Please analyze a resume first.";
    return;
  }

  const data = JSON.parse(stored);
  dateEl.textContent = new Date().toLocaleString();

  const list = (arr) =>
    arr && arr.length ? arr.map((item) => `• ${item}`).join("\n") : "• None";

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

  // Show text in report card
  reportEl.textContent = reportText;

  // PDF Download
  downloadBtn.addEventListener("click", async () => {
    // Load html2pdf.js dynamically if not loaded
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
  });
});
results.js;
