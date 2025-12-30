
import { GoogleGenAI } from "@google/genai";
import { Match } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMatchAnalysis = async (match: Match): Promise<string> => {
  try {
    const prompt = `
      بصفتك خبيراً رياضياً ومحللاً لكرة القدم، قم بتحليل المباراة التالية وقدم توقعاً للنتيجة النهائية بناءً على المعطيات المتاحة:
      المباراة: ${match.homeTeam.name} ضد ${match.awayTeam.name}
      البطولة: ${match.league}
      الحالة الحالية: ${match.status === 'LIVE' ? `مباشرة (الدقيقة ${match.minute}, النتيجة ${match.homeScore}-${match.awayScore})` : 'لم تبدأ بعد'}
      
      يرجى تقديم التحليل باللغة العربية بأسلوب مشوق ومختصر، يتضمن:
      1. تحليل سريع لقوة الفريقين.
      2. توقع النتيجة النهائية.
      3. اللاعب المتوقع تألقه.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "عذراً، لم نتمكن من الحصول على تحليل في الوقت الحالي.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "حدث خطأ أثناء محاولة تحليل المباراة. يرجى المحاولة لاحقاً.";
  }
};
