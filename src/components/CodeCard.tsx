import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, GitCompare, Lightbulb, type LucideProps } from "lucide-react";
import type { ComponentType } from "react";
import { toast } from "sonner";
import { diffLines, diffStats } from "@/lib/diff";

type Props = {
  icon?: ComponentType<LucideProps>;
  title: string;
  code: string;
  originalCode?: string;
};

export const CodeCard = ({ icon: Icon = Lightbulb, title, code, originalCode }: Props) => {
  const [copied, setCopied] = useState(false);
  const [showDiff, setShowDiff] = useState(true);
  const display = code?.trim() ? code : "No improved code available";
  const canDiff = !!originalCode && !!code?.trim();
  const lines = canDiff ? diffLines(originalCode!, code) : [];
  const stats = canDiff ? diffStats(lines) : { added: 0, removed: 0 };

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
    <Card className="surface-card surface-card-hover p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-semibold flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary"
            aria-hidden
          >
            <Icon size={16} strokeWidth={2.4} />
          </span>
          <span className="tracking-tight">{title}</span>
          {canDiff && (stats.added > 0 || stats.removed > 0) && (
            <span className="ml-1 flex items-center gap-1 text-xs font-mono">
              <span className="text-emerald-400">+{stats.added}</span>
              <span className="text-rose-400">-{stats.removed}</span>
            </span>
          )}
        </h2>
        <div className="flex items-center gap-1">
          {canDiff && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDiff((v) => !v)}
              className="h-8 px-2 gap-1 text-muted-foreground hover:text-foreground"
              aria-label="Toggle diff"
            >
              <GitCompare className="h-4 w-4" />
              <span className="text-xs">{showDiff ? "Plain" : "Diff"}</span>
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-8 px-2 gap-1 text-muted-foreground hover:text-foreground"
            aria-label="Copy code"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="text-xs">Copy</span>
          </Button>
        </div>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "hsl(0 0% 6%)",
          border: "1px solid hsl(0 0% 100% / 0.04)",
        }}
      >
        {canDiff && showDiff ? (
          <div className="overflow-x-auto text-[12.5px] leading-relaxed font-mono">
            {lines.map((l, idx) => {
              const bg =
                l.type === "add"
                  ? "bg-emerald-500/10"
                  : l.type === "remove"
                    ? "bg-rose-500/10"
                    : "";
              const marker =
                l.type === "add" ? "+" : l.type === "remove" ? "-" : " ";
              const markerColor =
                l.type === "add"
                  ? "text-emerald-400"
                  : l.type === "remove"
                    ? "text-rose-400"
                    : "text-muted-foreground/50";
              return (
                <div key={idx} className={`flex ${bg}`}>
                  <span
                    className={`select-none w-6 shrink-0 text-center ${markerColor} border-r border-border/40`}
                  >
                    {marker}
                  </span>
                  <pre className="px-3 py-0.5 flex-1 whitespace-pre text-foreground/90">
                    <code>{l.text || " "}</code>
                  </pre>
                </div>
              );
            })}
          </div>
        ) : (
          <pre className="overflow-x-auto p-4 text-[12.5px] leading-relaxed font-mono text-foreground/90">
            <code className="whitespace-pre">{display}</code>
          </pre>
        )}
      </div>
    </Card>
  );
};