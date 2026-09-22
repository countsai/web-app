import { NextRequest, NextResponse } from "next/server";

const GEMINI_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

const PROMPT = `You are a CV/resume parser. Extract ALL information from this CV/resume document.

Return ONLY a raw JSON object (no markdown, no code fences, no explanation) with exactly this structure:
{
  "title": "Mr or Ms or Dr or Prof or Mx or empty string",
  "firstName": "",
  "lastName": "",
  "phone": "",
  "tagline": "short professional headline under 120 chars",
  "bio": "professional summary paragraph",
  "experience": [
    {
      "jobTitle": "",
      "company": "",
      "location": "",
      "startDate": "e.g. Jan 2022",
      "endDate": "e.g. Dec 2024 or Present",
      "current": false,
      "responsibilities": ["bullet 1", "bullet 2"]
    }
  ],
  "education": [
    {
      "degree": "",
      "field": "",
      "institution": "",
      "startYear": "",
      "endYear": "",
      "grade": ""
    }
  ],
  "skills": ["skill1", "skill2"],
  "certifications": [{ "name": "", "issuer": "", "year": "", "url": "" }],
  "languages": [{ "language": "", "proficiency": "Native or Fluent or Professional or Conversational or Basic" }],
  "publications": [{ "title": "", "publisher": "", "year": "", "url": "" }],
  "researchWorks": [{ "title": "", "institution": "", "year": "", "description": "" }],
  "awards": [{ "title": "", "issuer": "", "year": "", "description": "" }]
}

Important: experience sorted newest first, empty array if section absent, raw JSON only.`;

function extractJson(text: string): string {
  // Strip markdown code fences if present
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  // Find first { and last } to extract bare JSON
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);
  return text.trim();
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Gemini inline_data only reliably supports PDF — reject other types
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return NextResponse.json(
        { error: "Please upload a PDF file. Word documents are not supported by the AI parser." },
        { status: 400 }
      );
    }

    const buf = await file.arrayBuffer();
    const b64 = Buffer.from(buf).toString("base64");

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: "application/pdf", data: b64 } },
            { text: PROMPT },
          ],
        }],
        // Do NOT set response_mime_type here — it conflicts with PDF inline_data in some cases
        generationConfig: { temperature: 0.1, maxOutputTokens: 8192 },
      }),
    });

    const geminiBody = await geminiRes.text();

    if (!geminiRes.ok) {
      console.error("[parse-resume] Gemini API error:", geminiRes.status, geminiBody);
      return NextResponse.json({ error: "Gemini API error", detail: geminiBody }, { status: 502 });
    }

    let geminiJson: { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    try {
      geminiJson = JSON.parse(geminiBody);
    } catch {
      console.error("[parse-resume] Could not parse Gemini response:", geminiBody.slice(0, 500));
      return NextResponse.json({ error: "Invalid response from Gemini" }, { status: 502 });
    }

    const raw = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    if (!raw) {
      console.error("[parse-resume] Empty text from Gemini. Full response:", JSON.stringify(geminiJson).slice(0, 500));
      return NextResponse.json({ error: "Gemini returned no text" }, { status: 502 });
    }

    const jsonStr = extractJson(raw);
    try {
      const parsed = JSON.parse(jsonStr);
      return NextResponse.json(parsed);
    } catch {
      console.error("[parse-resume] JSON parse failed. Raw text:", raw.slice(0, 500));
      return NextResponse.json({ error: "Could not parse AI response as JSON" }, { status: 502 });
    }
  } catch (e) {
    console.error("[parse-resume] Unexpected error:", e);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
