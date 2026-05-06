const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM =
  "You are Buddy, a friendly programming mentor for absolute beginners. Use simple words, short sentences, analogies, and concrete examples.";

function buildPrompt(topic: string, hint: string) {
  return `Teach the topic: ${topic}.
Context: ${hint}

Return STRICT JSON ONLY in this shape:
{
  "intro": "1-2 sentence friendly intro to the topic",
  "explanation": "3-5 short paragraphs in plain language with an analogy",
  "example_code": "a small beginner example as raw code (no markdown fences)",
  "language": "the programming language used in example_code (e.g. JavaScript, C, Python)",
  "breakdown": ["short bullet explaining a key line", "...", "..."],
  "quiz": [
    {"question":"...","options":["a","b","c","d"],"answer_index":0,"explanation":"why"}
  ],
  "tasks": ["small beginner exercise 1", "small beginner exercise 2"]
}

Rules:
- 3 quiz questions, each multiple choice with 4 options
- 2 practice tasks, beginner-friendly and concrete
- Keep everything concise and engaging
- No markdown fences anywhere. Return valid JSON only.`;
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
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, hint } = await req.json();
    if (!topic || typeof topic !== "string") {
      return new Response(JSON.stringify({ error: "Missing topic" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: buildPrompt(topic, hint || "") },
        ],
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI error", resp.status, t);
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: `AI gateway error (${resp.status})` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    const parsed = safeParse(content);
    if (!parsed) {
      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const toArr = (v: unknown): string[] =>
      Array.isArray(v) ? v.map(String) : typeof v === "string" && v.trim() ? [v] : [];

    const quiz = Array.isArray(parsed.quiz)
      ? parsed.quiz.map((q: any) => ({
          question: String(q?.question ?? ""),
          options: Array.isArray(q?.options) ? q.options.map(String).slice(0, 4) : [],
          answer_index: Number.isInteger(q?.answer_index) ? q.answer_index : 0,
          explanation: String(q?.explanation ?? ""),
        }))
      : [];

    const result = {
      intro: typeof parsed.intro === "string" ? parsed.intro : "",
      explanation: typeof parsed.explanation === "string" ? parsed.explanation : "",
      example_code: typeof parsed.example_code === "string"
        ? parsed.example_code.replace(/^```[a-zA-Z]*\n?|\n?```$/g, "")
        : "",
      language: typeof parsed.language === "string" ? parsed.language : "code",
      breakdown: toArr(parsed.breakdown),
      quiz,
      tasks: toArr(parsed.tasks),
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("practice-lesson error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});