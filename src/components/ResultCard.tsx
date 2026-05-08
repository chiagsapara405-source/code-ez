import { useState, type ComponentType } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, type LucideProps } from "lucide-react";
import { toast } from "sonner";

type Props = {
  icon: ComponentType<LucideProps>;
  title: string;
  content: string | string[];
  ordered?: boolean;
};

export const ResultCard = ({ icon: Icon, title, content, ordered }: Props) => {
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
          <ol className="list-decimal list-inside space-y-2.5 text-[14px] text-foreground/90 prose-lesson">
            {content.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        ) : (
          <ul className="list-disc list-inside space-y-2.5 text-[14px] text-foreground/90 prose-lesson">
            {content.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
      ) : (
        <p className="text-[14px] text-foreground/90 prose-lesson whitespace-pre-wrap">
          {content}
        </p>
      )}
    </Card>
  );
};