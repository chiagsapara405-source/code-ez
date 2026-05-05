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
import { Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");

  const disabled = code.trim().length === 0;

  const onSubmit = () => {
    if (disabled) return;
    navigate("/result", { state: { code, language } });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">CodeBuddy</h1>
          <p className="mt-2 text-muted-foreground">
            Explain code. Crack exams.
          </p>
        </header>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <label className="block text-sm font-medium">Your code</label>
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
              Explain Code
            </Button>
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
