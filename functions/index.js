/**
 * Firebase Cloud Functions (v2)
 */

const { setGlobalOptions } = require("firebase-functions");
const { onCall } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Limit max containers (cost control)
setGlobalOptions({ maxInstances: 10 });

/**
 * 🔹 analyzeResume
 * Callable function used by frontend:
 * httpsCallable(functions, "analyzeResume")
 */
exports.analyzeResume = onCall(async (request) => {
  try {
    const { prompt } = request.data;

    if (!prompt) {
      throw new Error("No prompt provided.");
    }

    // 🔐 Get Gemini API Key from environment variable
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key not configured.");
    }

    // 🔹 Call Gemini REST API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
      logger.error("Gemini API Error:", data);
      throw new Error("Gemini API request failed.");
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return { text };
  } catch (error) {
    logger.error("analyzeResume error:", error);
    throw new Error(error.message || "AI processing failed.");
  }
});
