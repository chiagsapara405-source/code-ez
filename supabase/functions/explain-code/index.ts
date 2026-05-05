const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = "You are a beginner-friendly programming tutor.";

function buildPrompt(code: string, language: string) {
  return `Analyze the following code:

${code}

Language: ${language}

Return output in JSON format:

{
  "explanation": "Line-by-line explanation in simple terms",
  "summary": "2-3 line summary",
  "mistakes": "List mistakes or bad practices",
  "questions": ["5 exam questions"],
  "tasks": ["3 practice tasks"]
}

Keep explanations simple and beginner-friendly. Respond with ONLY valid JSON, no markdown fences.`;
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
    const { code, language } = await req.json();
    if (!code || typeof code !== "string" || !language) {
      return new Response(
        JSON.stringify({ error: "Missing code or language" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: buildPrompt(code, language) },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("OpenAI error", resp.status, t);
      return new Response(
        JSON.stringify({ error: `OpenAI error (${resp.status})` }),
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

    const result = {
      explanation: typeof parsed.explanation === "string" ? parsed.explanation : "",
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      mistakes: typeof parsed.mistakes === "string"
        ? parsed.mistakes
        : Array.isArray(parsed.mistakes)
        ? parsed.mistakes.join("\n")
        : "",
      questions: Array.isArray(parsed.questions) ? parsed.questions.map(String) : [],
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks.map(String) : [],
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