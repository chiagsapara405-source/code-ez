import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ResultCard } from "@/components/ResultCard";
import { explainCode, type ExplainResult } from "@/services/explainCode";

type LocationState = { code?: string; language?: string };

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExplainResult | null>(null);
  const [examMode, setExamMode] = useState(false);

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
        const result = await explainCode(state.code!, state.language!);
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
  }, [state.code, state.language, navigate]);

  return (
    <main className="min-h-screen bg-background text-foreground">
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

          <div className="flex items-center gap-2">
            <Label htmlFor="exam-mode" className="text-sm text-muted-foreground">
              Exam Mode
            </Label>
            <Switch
              id="exam-mode"
              checked={examMode}
              onCheckedChange={setExamMode}
            />
          </div>
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
            {!examMode && (
              <ResultCard
                icon="🧠"
                title="Explanation"
                content={data.explanation}
              />
            )}
            <ResultCard icon="📌" title="Summary" content={data.summary} />
            {!examMode && (
              <ResultCard
                icon="⚠️"
                title="Mistakes"
                content={data.mistakes}
              />
            )}
            <ResultCard
              icon="❓"
              title="Exam Questions"
              content={data.questions}
              ordered
            />
            {!examMode && (
              <ResultCard
                icon="🧪"
                title="Practice Tasks"
                content={data.tasks}
                ordered
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Result;