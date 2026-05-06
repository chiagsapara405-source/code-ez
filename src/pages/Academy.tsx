import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, GraduationCap, Sparkles, ArrowRight } from "lucide-react";
import { TOPICS, type Topic } from "@/lib/topics";
import { AppNav } from "@/components/AppNav";

const LAST_KEY = "codebuddy:lastTopic";

const TopicCard = ({ topic }: { topic: Topic }) => {
  const Icon = topic.icon;
  return (
    <Link to={`/academy/${topic.id}`} className="group">
      <Card className="h-full p-4 rounded-2xl bg-card border-border hover:border-primary/50 transition-colors">
        <div className="flex items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[28%] bg-primary text-primary-foreground"
            style={{
              boxShadow:
                "0 0 18px 0 hsl(var(--primary) / 0.45), 0 0 36px 4px hsl(var(--primary) / 0.18)",
            }}
          >
            <Icon size={20} strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold tracking-tight truncate">{topic.title}</h3>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {topic.description}
            </p>
            <span
              className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                topic.difficulty === "Beginner"
                  ? "bg-primary/15 text-primary"
                  : "bg-amber-500/15 text-amber-400"
              }`}
            >
              {topic.difficulty}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

const Academy = () => {
  const [q, setQ] = useState("");
  const lastId = typeof window !== "undefined" ? localStorage.getItem(LAST_KEY) : null;
  const lastTopic = TOPICS.find((t) => t.id === lastId);

  const filtered = useMemo(
    () =>
      TOPICS.filter((t) =>
        (t.title + " " + t.description).toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  const recommended = TOPICS.filter((t) => t.difficulty === "Beginner").slice(0, 3);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AppNav />
      <div className="mx-auto max-w-3xl px-5 py-8">
        <header className="mb-6 flex items-center gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-[28%] bg-primary text-primary-foreground"
            style={{
              boxShadow:
                "0 0 30px 0 hsl(var(--primary) / 0.55), 0 0 60px 6px hsl(var(--primary) / 0.2)",
            }}
          >
            <GraduationCap className="h-6 w-6" strokeWidth={2.5} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Practice Academy</h1>
            <p className="text-sm text-muted-foreground">
              Learn coding with Buddy, your AI mentor.
            </p>
          </div>
        </header>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search topics…"
            className="pl-9 bg-card border-border"
          />
        </div>

        {lastTopic && (
          <section className="mb-6">
            <h2 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Continue learning
            </h2>
            <TopicCard topic={lastTopic} />
          </section>
        )}

        {!q && (
          <section className="mb-6">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Recommended
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommended.map((t) => (
                <TopicCard key={t.id} topic={t} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            All topics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((t) => (
              <TopicCard key={t.id} topic={t} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">No topics found.</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default Academy;