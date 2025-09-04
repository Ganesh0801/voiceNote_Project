const fs = require("fs");
const {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} = require("@google/genai");
require("dotenv").config();

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const geminiTranscribe = async (audioFilePath, retries = 5, backoff = 1000) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  for (let i = 0; i <= retries; i++) {
    try {
      const uploadedFile = await ai.files.upload({
        file: audioFilePath,
        config: { mimeType: "audio/mpeg" },
      });

      const prompt = "Generate a transcript of the speech.";

      const contents = createUserContent([
        createPartFromUri(uploadedFile.uri, uploadedFile.mimeType),
        prompt,
      ]);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
      });
      console.log("response", response.text);
      return response.text;
    } catch (err) {
      if (err.status === 429 && i < retries) {
        console.warn(
          `Rate limited. Retrying transcription attempt ${
            i + 1
          } in ${backoff}ms`
        );
        await delay(backoff);
        backoff *= 2;
      } else {
        throw err;
      }
    }
  }
};

const geminiSummarize = async (text, retries = 5, backoff = 1000) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = `Summarize the following note concisely:\n\n${text}\n\nSummary:`;

  for (let i = 0; i <= retries; i++) {
    try {
      const contents = createUserContent([prompt]);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
      });

      return response.text;
    } catch (err) {
      if (err.status === 429 && i < retries) {
        console.warn(
          `Rate limited. Retrying summarization attempt ${
            i + 1
          } in ${backoff}ms`
        );
        await delay(backoff);
        backoff *= 2;
      } else {
        throw err;
      }
    }
  }
};

module.exports = { geminiTranscribe, geminiSummarize };
