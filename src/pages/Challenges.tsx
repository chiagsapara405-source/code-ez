import { useState } from "react";
import { motion } from "framer-motion";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Target, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Challenge = {
  id: string;
  type: "predict" | "find_error" | "fill_blank";
  prompt: string;
  code: string;
  options: string[];
  answer: number;
  explanation: string;
  xp: number;
};

const CHALLENGES: Challenge[] = [
  {
    id: "c1",
    type: "predict",
    prompt: "What does this print?",
    code: `let x = 0;\nfor (let i = 1; i <= 3; i++) x += i;\nconsole.log(x);`,
    options: ["3", "6", "9", "0"],
    answer: 1,
    explanation: "1 + 2 + 3 = 6",
    xp: 15,
  },
  {
    id: "c2",
    type: "find_error",
    prompt: "Which line has the bug?",
    code: `1: function add(a, b) {\n2:   return a - b;\n3: }\n4: add(2, 3);`,
    options: ["Line 1", "Line 2", "Line 3", "Line 4"],
    answer: 1,
    explanation: "It uses subtraction instead of addition.",
    xp: 20,
  },
  {
    id: "c3",
    type: "fill_blank",
    prompt: "Pick the missing keyword.",
    code: `____ greet() {\n  return "hi";\n}`,
    options: ["var", "function", "if", "return"],
    answer: 1,
    explanation: "`function` declares a function.",
    xp: 10,
  },
];

const TYPE_LABEL: Record<Challenge["type"], string> = {
  predict: "Predict Output",
  find_error: "Find the Bug",
  fill_blank: "Fill the Blank",
};

const Challenges = () => {
  const { user } = useAuth();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const ch = CHALLENGES[idx];
  const done = idx >= CHALLENGES.length;

  const choose = async (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === ch.answer) {
      setScore((s) => s + ch.xp);
      toast.success(`+${ch.xp} XP`);
    }
  };

  const next = async () => {
    if (idx === CHALLENGES.length - 1) {
      // persist on completion
      if (user) {
        await supabase.from("practice_attempts").insert({
          user_id: user.id,
          challenge_type: "mixed",
          score,
          total: CHALLENGES.reduce((s, c) => s + c.xp, 0),
        });
        // bump XP on profile
        const { data: p } = await supabase
          .from("profiles")
          .select("total_xp")
          .eq("user_id", user.id)
          .maybeSingle();
        await supabase
          .from("profiles")
          .update({ total_xp: (p?.total_xp ?? 0) + score })
          .eq("user_id", user.id);
      }
    }
    setPicked(null);
    setIdx((i) => i + 1);
  };

  const reset = () => {
    setIdx(0);
    setScore(0);
    setPicked(null);
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      <div className="mx-auto max-w-2xl px-5 pt-8">
        <header className="mb-6 flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
            style={{ boxShadow: "0 0 20px 0 hsl(var(--primary) / 0.5)" }}
          >
            <Target className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Challenges</h1>
            <p className="text-xs text-muted-foreground">
              Quick brain workouts · earn XP
            </p>
          </div>
        </header>

        {!done ? (
          <motion.div
            key={ch.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border bg-card p-5"
          >
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-primary font-semibold">
                {TYPE_LABEL[ch.type]}
              </span>
              <span className="text-muted-foreground">
                {idx + 1} / {CHALLENGES.length}
              </span>
            </div>
            <h2 className="mb-3 text-base font-semibold">{ch.prompt}</h2>
            <pre className="mb-4 overflow-x-auto rounded-xl border border-border bg-background p-3 text-xs leading-relaxed">
              <code>{ch.code}</code>
            </pre>
            <div className="grid gap-2">
              {ch.options.map((opt, i) => {
                const isPicked = picked === i;
                const isCorrect = picked !== null && i === ch.answer;
                const isWrongPick = isPicked && i !== ch.answer;
                return (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    disabled={picked !== null}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      isCorrect
                        ? "border-primary bg-primary/15 text-foreground"
                        : isWrongPick
                        ? "border-destructive/60 bg-destructive/10"
                        : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    <span>{opt}</span>
                    {isCorrect && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    {isWrongPick && <XCircle className="h-4 w-4 text-destructive" />}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div className="mt-4 rounded-xl border border-border bg-background p-3 text-xs">
                <p className="font-semibold mb-1 text-primary">Why?</p>
                <p className="text-muted-foreground">{ch.explanation}</p>
              </div>
            )}
            {picked !== null && (
              <Button onClick={next} className="mt-4 w-full">
                {idx === CHALLENGES.length - 1 ? "Finish" : "Next"}
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-primary/30 bg-card p-6 text-center"
            style={{ boxShadow: "0 0 40px -10px hsl(var(--primary) / 0.55)" }}
          >
            <Sparkles className="mx-auto mb-3 h-10 w-10 text-primary" />
            <h2 className="text-xl font-bold">Set complete!</h2>
            <p className="mt-1 text-sm text-muted-foreground">You earned</p>
            <p className="mt-1 text-4xl font-extrabold text-primary">+{score} XP</p>
            <Button onClick={reset} className="mt-5 w-full">
              Play again
            </Button>
          </motion.div>
        )}
      </div>
      <AppNav />
    </main>
  );
};

export default Challenges;