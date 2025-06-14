import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  const allowedOrigin = "https://yujinshim05.github.io"; // GitHub Pages 주소
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { location, startDate, endDate } = req.body;

  if (!location || !startDate || !endDate) {
  return res.status(400).json({ error: "location, startDate, endDate 값이 모두 필요합니다." });
}


  try {
    const prompt = `
      ${location}에 ${startDate}부터 ${endDate}까지 여행을 간다면 어떤 옷차림이 적절할지 알려줘. 그리고 최저기온과 최고기온, 강수확률 등도 알려줘.
      날씨와 계절, 일반적인 장소 환경을 고려해서 구체적인 옷차림을 제안해줘. 간결하게
    `;

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "당신은 여행 옷차림 추천 전문가입니다. 계절과 날씨를 고려해 실용적이고 구체적인 옷차림을 간결하게 제안해주세요. 너무 추상적인 표현은 피해주세요.",
      },
    });

    res.status(200).json({ answer: result.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini API 호출 중 오류 발생" });
  }
}
