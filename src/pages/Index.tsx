import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { EXAMPLES } from "@/lib/examples";
import { AppNav } from "@/components/AppNav";

const Index = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [examMode, setExamMode] = useState(false);

  const disabled = code.trim().length === 0;

  const loadExample = (i: number) => {
    const ex = EXAMPLES[i];
    setCode(ex.code);
    setLanguage(ex.language);
  };

  const onSubmit = () => {
    if (disabled) return;
    navigate("/result", { state: { code: code.trim(), language, examMode } });
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      <AppNav />
      <div className="mx-auto max-w-2xl px-5 py-10">
        <header className="mb-8 flex flex-col items-center text-center">
          <div
            className="mb-5 flex h-20 w-20 items-center justify-center rounded-[28%] bg-primary text-primary-foreground"
            style={{
              boxShadow:
                "0 0 60px 0 hsl(var(--primary) / 0.55), 0 0 120px 10px hsl(var(--primary) / 0.25)",
            }}
            aria-hidden
          >
            <Code2 className="h-10 w-10" strokeWidth={2.5} />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight">CodeBuddy</h1>
          <p className="mt-3 text-muted-foreground">
            Understand code. Prepare for exams.
          </p>
        </header>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Your code</label>
            {code && (
              <button
                type="button"
                onClick={() => setCode("")}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          <div>
            <p className="mb-2 text-xs text-muted-foreground">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex, i) => (
                <Badge
                  key={ex.label}
                  variant="secondary"
                  onClick={() => loadExample(i)}
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors px-3 py-1.5 rounded-full text-xs font-normal"
                >
                  {ex.label}
                </Badge>
              ))}
            </div>
          </div>

          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="min-h-[260px] font-mono text-sm bg-background border-border resize-y"
            spellCheck={false}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Language</span>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-36 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="C++">C++</SelectItem>
                  <SelectItem value="JavaScript">JavaScript</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={onSubmit}
              disabled={disabled}
              className="gap-2"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              Analyze Code
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
            <div>
              <Label htmlFor="exam-mode" className="text-sm font-medium">
                Exam Mode
              </Label>
              <p className="text-xs text-muted-foreground">
                Prioritize questions & summary
              </p>
            </div>
            <Switch
              id="exam-mode"
              checked={examMode}
              onCheckedChange={setExamMode}
            />
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Powered by AI · Beginner-friendly explanations
        </p>
      </div>
    </main>
  );
};

export default Index;
