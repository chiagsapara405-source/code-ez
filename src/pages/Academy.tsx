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
      <Card className="surface-card surface-card-hover h-full p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon size={18} strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[15px] font-semibold tracking-tight truncate">{topic.title}</h3>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="mt-1 text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">
              {topic.description}
            </p>
            <span
              className={`mt-3 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
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
    <main className="min-h-screen bg-background text-foreground pb-24">
      <AppNav />
      <div className="mx-auto max-w-3xl px-5 pt-10">
        <header className="mb-7">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80 flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-primary/80" /> Practice Academy
          </p>
          <h1 className="mt-1 text-[26px] font-bold tracking-tight">What will you learn today?</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Bite-sized lessons, guided by Buddy.
          </p>
        </header>

        <div className="relative mb-7">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search topics…"
            className="pl-9 bg-card border-white/[0.05] h-11 rounded-xl"
          />
        </div>

        {lastTopic && (
          <section className="mb-7">
            <h2 className="mb-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
              Continue learning
            </h2>
            <TopicCard topic={lastTopic} />
          </section>
        )}

        {!q && (
          <section className="mb-7">
            <h2 className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
              <Sparkles className="h-3 w-3 text-primary/80" /> Recommended
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {recommended.map((t) => (
                <TopicCard key={t.id} topic={t} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
            All topics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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