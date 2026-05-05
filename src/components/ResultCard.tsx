import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

type Props = {
  icon: string;
  title: string;
  content: string | string[];
  ordered?: boolean;
};

export const ResultCard = ({ icon, title, content, ordered }: Props) => {
  const [copied, setCopied] = useState(false);

  const text = Array.isArray(content)
    ? content.map((c, i) => `${i + 1}. ${c}`).join("\n")
    : content || "—";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const isEmpty = Array.isArray(content) ? content.length === 0 : !content;

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
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
          aria-label={`Copy ${title}`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      {isEmpty ? (
        <p className="text-sm text-muted-foreground">—</p>
      ) : Array.isArray(content) ? (
        ordered ? (
          <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/90">
            {content.map((item, i) => (
              <li key={i} className="leading-relaxed">{item}</li>
            ))}
          </ol>
        ) : (
          <ul className="list-disc list-inside space-y-2 text-sm text-foreground/90">
            {content.map((item, i) => (
              <li key={i} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        )
      ) : (
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      )}
    </Card>
  );
};