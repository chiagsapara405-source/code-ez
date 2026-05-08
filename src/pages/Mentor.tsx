import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AppNav } from "@/components/AppNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Send, Loader2 } from "lucide-react";
import { askMentor, type ChatMsg } from "@/services/practice";
import { toast } from "sonner";

const Mentor = () => {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm Buddy 🤖 — your coding mentor. Ask me anything about programming concepts, errors, or what to learn next. I'll guide you, not just hand you answers.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const reply = await askMentor("general programming", "", next);
      setMessages((m) => [...m, { role: "assistant", content: reply || "..." }]);
    } catch (e: any) {
      toast.error(e?.message ?? "Mentor unavailable");
    } finally {
      setBusy(false);
    }
  };

  const suggestions = [
    "What's a loop?",
    "Explain recursion simply",
    "What should I learn next?",
  ];

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground pb-24">
      <header className="sticky top-0 z-20 border-b border-white/[0.04] bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <Bot className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div>
            <h1 className="text-[17px] font-bold tracking-tight">Buddy</h1>
            <p className="text-[11px] text-muted-foreground">AI coding mentor · always patient</p>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-5 py-4 space-y-3">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "surface-card"
                }`}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
          {busy && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Buddy is thinking…
            </div>
          )}
          {messages.length === 1 && (
            <div className="pt-2 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="rounded-full border border-white/[0.05] bg-card px-3 py-1.5 text-[12px] text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-[68px] border-t border-white/[0.04] bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-5 py-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Buddy anything…"
            className="bg-card border-white/[0.05] rounded-xl"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <Button onClick={send} disabled={busy || !input.trim()} size="icon" className="rounded-xl glow-primary-soft">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <AppNav />
    </main>
  );
};

export default Mentor;