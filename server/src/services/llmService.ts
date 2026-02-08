import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: "https://api.anthropic.com/v1",
  defaultHeaders: {
    "anthropic-version": "2023-06-01"
  }
});

export const convertToSql = async (
  query: string,
  schema: string,
  dbType: string
): Promise<string> => {
  const prompt = `You are a SQL expert. Convert the following natural language query into a valid SQL query.
Database Type: ${dbType}
Database Schema: ${schema}

Query: "${query}"

Return ONLY the raw SQL query string. Do not include any formatting, markdown, or explanation.`;

  try {
    const response = await client.chat.completions.create({
       model: "claude-opus-4-6", 
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    console.log(response);

    const sql = response.choices[0]?.message?.content?.trim() || '';
    return sql.replace(/```sql|```/g, '').trim();
  } catch (error: any) {
    console.error('Claude OpenAI Error:', error);
    throw new Error('Failed to generate SQL with Claude (OpenAI SDK): ' + error.message);
  }
};
