import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  Loader2,
  Brain,
  Pin,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  FlaskConical,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { ResultCard } from "@/components/ResultCard";
import { CodeCard } from "@/components/CodeCard";
import { explainCode, type ExplainResult } from "@/services/explainCode";
import { AppNav } from "@/components/AppNav";

type LocationState = { code?: string; language?: string; examMode?: boolean };

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExplainResult | null>(null);
  const [explainOpen, setExplainOpen] = useState(false);
  const examMode = !!state.examMode;

  useEffect(() => {
    if (!state.code || !state.language) {
      navigate("/", { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await explainCode(state.code!, state.language!, examMode);
        if (!cancelled) setData(result);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Something went wrong";
        if (!cancelled) {
          setError(msg);
          toast.error(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [state.code, state.language, examMode, navigate]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AppNav />
      <div className="mx-auto max-w-2xl px-5 py-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {examMode && (
            <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
              Exam Mode
            </span>
          )}
        </div>

        <h1 className="mb-1 text-2xl font-bold">Results</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          {state.language} · {examMode ? "Exam mode" : "Full breakdown"}
        </p>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-3" />
            <p className="text-sm">Analyzing your code…</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-destructive/40 bg-card p-5">
            <h2 className="font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate("/")}>Try again</Button>
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-4">
            {data.summary && (
              <ResultCard icon={Pin} title="Summary" content={data.summary} />
            )}
            {data.concepts.length > 0 && (
              <ResultCard
                icon={Brain}
                title="Key Concepts"
                content={data.concepts}
              />
            )}
            {data.mistakes.length > 0 && (
              <ResultCard
                icon={AlertTriangle}
                title="Mistakes"
                content={data.mistakes}
              />
            )}
            {data.questions.length > 0 && (
              <ResultCard
                icon={HelpCircle}
                title="Exam Questions"
                content={data.questions}
                ordered
              />
            )}
            {data.tasks.length > 0 && (
              <ResultCard
                icon={FlaskConical}
                title="Practice Tasks"
                content={data.tasks}
                ordered
              />
            )}
            {data.fixed_code && (
              <CodeCard
                icon={Lightbulb}
                title="Corrected Code"
                code={data.fixed_code}
                originalCode={state.code}
              />
            )}
            {data.explanation.length > 0 && (
              <Collapsible open={explainOpen} onOpenChange={setExplainOpen}>
                <div className="rounded-2xl border border-border bg-card">
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-5 text-left">
                    <span className="flex items-center gap-3 text-base font-semibold tracking-tight">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-[28%] bg-primary text-primary-foreground"
                        style={{
                          boxShadow:
                            "0 0 18px 0 hsl(var(--primary) / 0.45), 0 0 36px 4px hsl(var(--primary) / 0.18)",
                        }}
                      >
                        <Brain className="h-4.5 w-4.5" strokeWidth={2.5} size={18} />
                      </span>
                      Explanation
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        explainOpen ? "rotate-180" : ""
                      }`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-5 pb-5">
                      <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/90">
                        {data.explanation.map((s, i) => (
                          <li key={i} className="leading-relaxed">{s}</li>
                        ))}
                      </ol>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Result;