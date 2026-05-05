const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = "You are a beginner-friendly programming tutor.";

function buildPrompt(code: string, language: string, examMode: boolean) {
  return `You are a programming tutor focused on helping students pass exams.

Analyze the following code.

Code:
${code}

Language:
${language}

Mode:
Exam Mode ${examMode ? "ON" : "OFF"}

Rules:
- Keep answers concise and structured
- Use bullet points where possible
- Avoid long paragraphs
- Focus on exam-relevant insights

Return STRICT JSON ONLY:

{
  "summary": "2-3 lines max",
  "concepts": ["key concept 1", "key concept 2"],
  "mistakes": ["mistake 1", "mistake 2"],
  "questions": ["question 1", "question 2", "question 3", "question 4", "question 5"],
  "tasks": ["task 1", "task 2", "task 3"],
  "explanation": ["step 1", "step 2", "step 3"],
  "fixed_code": "Corrected and improved version of the code as raw string (no markdown fences)"
}

If Exam Mode is ON:
- Prioritize questions and summary
- Keep explanation very short (1-3 steps)

Return valid JSON only. No extra text. For "fixed_code", return ONLY the raw code as a string (preserve newlines and indentation, no markdown fences).`;
}

function safeParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language, examMode } = await req.json();
    if (!code || typeof code !== "string" || !language) {
      return new Response(
        JSON.stringify({ error: "Missing code or language" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: buildPrompt(code, language, !!examMode) },
        ],
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("Lovable AI error", resp.status, t);
      if (resp.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (resp.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your Lovable workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: `AI gateway error (${resp.status})` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await resp.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    const parsed = safeParse(content);
    if (!parsed) {
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response", raw: content }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const toArr = (v: unknown): string[] =>
      Array.isArray(v) ? v.map(String) : typeof v === "string" && v.trim() ? [v] : [];

    const result = {
      summary: typeof parsed.summary === "string"
        ? parsed.summary
        : Array.isArray(parsed.summary)
        ? parsed.summary.join("\n")
        : "",
      concepts: toArr(parsed.concepts),
      mistakes: toArr(parsed.mistakes),
      questions: toArr(parsed.questions),
      tasks: toArr(parsed.tasks),
      explanation: toArr(parsed.explanation),
      fixed_code: typeof parsed.fixed_code === "string"
        ? parsed.fixed_code.replace(/^```[a-zA-Z]*\n?|\n?```$/g, "")
        : "",
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("explain-code error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});