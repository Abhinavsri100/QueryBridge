import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const convertToSql = async (
  query: string,
  schema: string,
  dbType: string
): Promise<string> => {
  const prompt = `
    You are a SQL expert. Convert the following natural language query into a valid SQL query.
    Database Type: ${dbType}
    Database Schema: ${schema}
    
    Query: "${query}"
    
    Return ONLY the raw SQL query string. Do not include any formatting, markdown, or explanation.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const sql = response.text().trim();
    
    // Basic sanitization (remove markdown if LLM ignored instructions)
    return sql.replace(/```sql|```/g, '').trim();
  } catch (error: any) {
    console.error('Gemini Error:', error);
    throw new Error('Failed to generate SQL with Gemini: ' + error.message);
  }
};
