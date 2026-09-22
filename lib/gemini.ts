// Thin wrapper around the Gemini REST API for the Rocket Boost AI tools.
// Server-only — relies on GEMINI_API_KEY, never expose this module to the client.

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonSchema = Record<string, any>;

export class GeminiError extends Error {}

/**
 * Calls Gemini with a prompt and a response JSON schema, returning the parsed object.
 */
export async function generateStructured<T>(prompt: string, schema: JsonSchema): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new GeminiError("GEMINI_API_KEY is not configured");

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.4,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new GeminiError(`Gemini API error (${res.status}): ${body}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new GeminiError("Gemini returned no content");

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new GeminiError("Gemini returned malformed JSON");
  }
}
