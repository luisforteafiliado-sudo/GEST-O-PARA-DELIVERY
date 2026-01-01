
// Always use import {GoogleGenAI} from "@google/genai";
import {GoogleGenAI} from "@google/genai";

export const getAIInsight = async (context: string) => {
  try {
    // Fixed: Strictly follow the GoogleGenAI initialization guideline using named parameter and no fallback
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Aja como uma PM Sênior e Consultora de Negócios para Delivery. 
      Analise o seguinte contexto financeiro de uma operação de restaurante e dê insights estratégicos curtos, práticos e acionáveis sobre rentabilidade, engenharia de cardápio e fluxo de caixa.
      
      Contexto: ${context}
      
      Formate a resposta em Markdown, use bullet points e seja direto ao ponto.`,
    });
    // Fixed: The GenerateContentResponse object features a text property that directly returns the string output.
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Desculpe, tive um problema ao analisar seus dados. Tente novamente em breve.";
  }
};
