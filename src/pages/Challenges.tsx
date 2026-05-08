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
      <div className="mx-auto max-w-2xl px-5 pt-10">
        <header className="mb-7 flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <Target className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div>
            <h1 className="text-[24px] font-bold tracking-tight">Challenges</h1>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Quick brain workouts · earn XP
            </p>
          </div>
        </header>

        {!done ? (
          <motion.div
            key={ch.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="surface-card p-6"
          >
            <div className="mb-4 flex items-center justify-between text-[11.5px]">
              <span className="rounded-full bg-primary/12 px-2.5 py-1 text-primary font-semibold">
                {TYPE_LABEL[ch.type]}
              </span>
              <span className="text-muted-foreground">
                {idx + 1} / {CHALLENGES.length}
              </span>
            </div>
            <h2 className="mb-4 text-[15.5px] font-semibold tracking-tight prose-lesson">{ch.prompt}</h2>
            <pre className="mb-5 overflow-x-auto rounded-xl border border-white/[0.04] bg-background/60 p-4 text-[12.5px] leading-relaxed font-mono">
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
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-[13.5px] transition-colors ${
                      isCorrect
                        ? "border-primary/40 bg-primary/10 text-foreground"
                        : isWrongPick
                        ? "border-destructive/40 bg-destructive/10"
                        : "border-white/[0.05] bg-background/60 hover:border-primary/30"
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
              <div className="mt-5 rounded-xl border border-white/[0.04] bg-background/60 p-4 text-[12.5px]">
                <p className="font-semibold mb-1.5 text-primary">Why?</p>
                <p className="text-muted-foreground prose-lesson">{ch.explanation}</p>
              </div>
            )}
            {picked !== null && (
              <Button onClick={next} className="mt-5 w-full glow-primary-soft rounded-xl">
                {idx === CHALLENGES.length - 1 ? "Finish" : "Next"}
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="surface-card p-7 text-center glow-primary"
          >
            <Sparkles className="mx-auto mb-3 h-9 w-9 text-primary" />
            <h2 className="text-[20px] font-bold tracking-tight">Set complete</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">You earned</p>
            <p className="mt-2 text-[40px] font-bold tracking-tight text-primary">+{score} XP</p>
            <Button onClick={reset} className="mt-6 w-full rounded-xl">
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