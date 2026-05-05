import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

type Props = {
  icon?: string;
  title: string;
  code: string;
};

export const CodeCard = ({ icon = "💡", title, code }: Props) => {
  const [copied, setCopied] = useState(false);
  const display = code?.trim() ? code : "No improved code available";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(display);
      setCopied(true);
      toast.success("Code copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <Card className="bg-card border-border p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span aria-hidden>{icon}</span>
          <span>{title}</span>
        </h2>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="h-8 px-2 gap-1 text-muted-foreground hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="text-xs">Copy Code</span>
        </Button>
      </div>

      <div
        className="rounded-xl border border-border/80 overflow-hidden"
        style={{
          background: "#111",
          boxShadow: "0 0 0 1px hsl(var(--primary) / 0.08), 0 0 24px -8px hsl(var(--primary) / 0.15)",
        }}
      >
        <pre className="overflow-x-auto p-4 text-[12.5px] leading-relaxed font-mono text-foreground/90">
          <code className="whitespace-pre">{display}</code>
        </pre>
      </div>
    </Card>
  );
};