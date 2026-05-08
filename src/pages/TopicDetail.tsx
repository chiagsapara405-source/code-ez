import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  BookOpen,
  Brain,
  Code2,
  ListChecks,
  HelpCircle,
  FlaskConical,
  Bot,
  Send,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CodeCard } from "@/components/CodeCard";
import { ResultCard } from "@/components/ResultCard";
import { AppNav } from "@/components/AppNav";
import { getTopic } from "@/lib/topics";
import { askMentor, fetchLesson, type ChatMsg, type Lesson } from "@/services/practice";

const LAST_KEY = "codebuddy:lastTopic";

const SectionHeader = ({
  icon: Icon,
  title,
}: {
  icon: any;
  title: string;
}) => (
  <h2 className="mb-4 flex items-center gap-3 text-[15px] font-semibold tracking-tight">
    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Icon size={16} strokeWidth={2.4} />
    </span>
    {title}
  </h2>
);

const QuizBlock = ({ lesson }: { lesson: Lesson }) => {
  const [picked, setPicked] = useState<Record<number, number>>({});
  if (!lesson.quiz?.length) return null;
  return (
    <Card className="surface-card p-6">
      <SectionHeader icon={HelpCircle} title="Quick Quiz" />
      <div className="space-y-5">
        {lesson.quiz.map((q, qi) => {
          const chosen = picked[qi];
          const answered = chosen !== undefined;
          return (
            <div key={qi}>
              <p className="text-sm font-medium mb-2">
                {qi + 1}. {q.question}
              </p>
              <div className="grid gap-2">
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === q.answer_index;
                  const isChosen = chosen === oi;
                  let cls =
                    "flex items-center justify-between gap-2 rounded-xl border border-white/[0.05] bg-background/60 px-3 py-2.5 text-[13.5px] transition-colors hover:border-primary/40";
                  if (answered && isCorrect)
                    cls =
                      "flex items-center justify-between gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2.5 text-[13.5px]";
                  else if (answered && isChosen && !isCorrect)
                    cls =
                      "flex items-center justify-between gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2.5 text-[13.5px]";
                  return (
                    <button
                      key={oi}
                      disabled={answered}
                      onClick={() => setPicked({ ...picked, [qi]: oi })}
                      className={cls}
                    >
                      <span>{opt}</span>
                      {answered && isCorrect && (
                        <Check className="h-4 w-4 text-emerald-400" />
                      )}
                      {answered && isChosen && !isCorrect && (
                        <X className="h-4 w-4 text-rose-400" />
                      )}
                    </button>
                  );
                })}
              </div>
              {answered && q.explanation && (
                <p className="mt-2 text-xs text-muted-foreground">{q.explanation}</p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const MentorChat = ({ topicTitle, lesson }: { topicTitle: string; lesson: Lesson }) => {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    const next: ChatMsg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const ctx = `${lesson.intro}\n\n${lesson.explanation}`;
      const reply = await askMentor(topicTitle, ctx, next);
      setMessages([...next, { role: "assistant", content: reply }]);
      setTimeout(() => scrollRef.current?.scrollTo({ top: 9e9 }), 50);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to ask Buddy");
    } finally {
      setSending(false);
    }
  };

  const suggestions = [
    `Explain ${topicTitle.toLowerCase()} simply`,
    "Show another example",
    "Why is this useful?",
  ];

  return (
    <Card className="surface-card p-6">
      <SectionHeader icon={Bot} title="Ask Buddy" />
      <div
        ref={scrollRef}
        className="max-h-72 overflow-y-auto space-y-3 mb-4 pr-1"
      >
        {messages.length === 0 && (
          <div className="text-[13.5px] text-muted-foreground">
            <p className="mb-3 prose-lesson">Ask Buddy anything about {topicTitle}.</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-white/[0.06] bg-background/60 px-3 py-1.5 text-[12px] hover:border-primary/40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-[13.5px] rounded-2xl px-3.5 py-2.5 max-w-[90%] whitespace-pre-wrap leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-background/60 border border-white/[0.05]"
            }`}
          >
            {m.content}
          </div>
        ))}
        {sending && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Buddy is thinking…
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-center gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          className="bg-background/60 border-white/[0.05] rounded-xl"
        />
        <Button type="submit" size="icon" disabled={sending || !input.trim()} className="rounded-xl glow-primary-soft">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
};

const TopicDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const topic = getTopic(id);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!topic) {
      navigate("/academy", { replace: true });
      return;
    }
    localStorage.setItem(LAST_KEY, topic.id);
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLesson(topic.title, topic.lesson_prompt);
        if (!cancelled) setLesson(data);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load lesson";
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
  }, [topic, navigate]);

  if (!topic) return null;
  const Icon = topic.icon;

  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      <AppNav />
      <div className="mx-auto max-w-3xl px-5 pt-6 pb-6">
        <div className="mb-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/academy")}
            className="gap-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" /> Academy
          </Button>
        </div>

        <header className="mb-7 flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <Icon className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <div>
            <h1 className="text-[24px] font-bold tracking-tight">{topic.title}</h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">{topic.description}</p>
          </div>
        </header>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="h-7 w-7 animate-spin mb-3 text-primary/80" />
            <p className="text-[13px]">Buddy is preparing your lesson…</p>
          </div>
        )}

        {!loading && error && (
          <Card className="surface-card p-6 border-destructive/30">
            <h2 className="font-semibold mb-2">Couldn't load lesson</h2>
            <p className="text-[13.5px] text-muted-foreground mb-4 prose-lesson">{error}</p>
            <Button onClick={() => navigate(0)}>Retry</Button>
          </Card>
        )}

        {!loading && !error && lesson && (
          <div className="space-y-5">
            {lesson.intro && (
              <ResultCard icon={BookOpen} title="Introduction" content={lesson.intro} />
            )}
            {lesson.explanation && (
              <ResultCard
                icon={Brain}
                title="Simple Explanation"
                content={lesson.explanation}
              />
            )}
            {lesson.example_code && (
              <CodeCard
                icon={Code2}
                title={`Example (${lesson.language || "code"})`}
                code={lesson.example_code}
              />
            )}
            {lesson.breakdown.length > 0 && (
              <ResultCard
                icon={ListChecks}
                title="Code Breakdown"
                content={lesson.breakdown}
              />
            )}
            <QuizBlock lesson={lesson} />
            {lesson.tasks.length > 0 && (
              <ResultCard
                icon={FlaskConical}
                title="Practice Tasks"
                content={lesson.tasks}
                ordered
              />
            )}
            <MentorChat topicTitle={topic.title} lesson={lesson} />
          </div>
        )}
      </div>
    </main>
  );
};

export default TopicDetail;