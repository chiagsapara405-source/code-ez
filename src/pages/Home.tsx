import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppNav } from "@/components/AppNav";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { TOPICS } from "@/lib/topics";
import { levelProgress } from "@/lib/xp";
import { ArrowRight, Brain, Wrench, Target, Sparkles, Flame } from "lucide-react";

type Stats = {
  totalXp: number;
  completed: number;
  lastTopicId: string | null;
  achievements: number;
  displayName: string;
};

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalXp: 0,
    completed: 0,
    lastTopicId: null,
    achievements: 0,
    displayName: "Learner",
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: profile }, { data: progress }, { count: achCount }] = await Promise.all([
        supabase.from("profiles").select("display_name,total_xp").eq("user_id", user.id).maybeSingle(),
        supabase
          .from("user_progress")
          .select("topic_id, completed, last_accessed")
          .eq("user_id", user.id)
          .order("last_accessed", { ascending: false }),
        supabase
          .from("user_achievements")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);
      setStats({
        totalXp: profile?.total_xp ?? 0,
        completed: (progress ?? []).filter((p) => p.completed).length,
        lastTopicId: (progress ?? [])[0]?.topic_id ?? null,
        achievements: achCount ?? 0,
        displayName: profile?.display_name ?? user.email?.split("@")[0] ?? "Learner",
      });
    })();
  }, [user]);

  const lvl = levelProgress(stats.totalXp);
  const resumeTopic = TOPICS.find((t) => t.id === stats.lastTopicId) ?? TOPICS[0];
  const recommended = TOPICS.filter((t) => t.id !== resumeTopic.id).slice(0, 4);

  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      <div className="mx-auto max-w-2xl px-5 pt-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Welcome back</p>
            <h1 className="text-2xl font-extrabold tracking-tight">Hey, {stats.displayName} 👋</h1>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-sm">
            <Flame className="h-4 w-4 text-primary" />
            <span className="font-semibold">{stats.totalXp}</span>
            <span className="text-muted-foreground">XP</span>
          </div>
        </header>

        {/* Level / Progress ring card */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-5 overflow-hidden rounded-3xl border border-border bg-card p-5"
          style={{ boxShadow: "0 0 60px -20px hsl(var(--primary) / 0.5)" }}
        >
          <div className="flex items-center gap-4">
            <ProgressRing percent={lvl.percent} label={`L${lvl.level}`} />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Level {lvl.level}</p>
              <p className="text-lg font-bold tracking-tight">
                {lvl.into} / {lvl.span} XP
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {stats.completed} lessons · {stats.achievements} badges
              </p>
            </div>
          </div>
        </motion.section>

        {/* Resume learning */}
        <Link
          to={`/academy/${resumeTopic.id}`}
          className="group mb-5 flex items-center justify-between rounded-3xl border border-primary/30 bg-card p-5 transition-colors hover:border-primary/60"
          style={{ boxShadow: "0 0 28px -10px hsl(var(--primary) / 0.55)" }}
        >
          <div className="flex items-center gap-4">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
              style={{ boxShadow: "0 0 18px 0 hsl(var(--primary) / 0.5)" }}
            >
              <resumeTopic.icon className="h-6 w-6" strokeWidth={2.5} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wider text-primary">Resume learning</p>
              <p className="text-base font-semibold">{resumeTopic.title}</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>

        {/* Quick tools */}
        <section className="mb-6 grid grid-cols-3 gap-3">
          {[
            { to: "/explain", icon: Brain, label: "Explain" },
            { to: "/refine", icon: Wrench, label: "Refine" },
            { to: "/challenges", icon: Target, label: "Practice" },
          ].map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-xs font-medium transition-colors hover:border-primary/40"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
                style={{ boxShadow: "inset 0 0 12px hsl(var(--primary) / 0.2)" }}
              >
                <Icon className="h-5 w-5" strokeWidth={2.4} />
              </span>
              {label}
            </Link>
          ))}
        </section>

        {/* Recommended */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" /> Recommended for you
            </h2>
            <Link to="/academy" className="text-xs text-muted-foreground hover:text-foreground">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recommended.map((t) => (
              <Link
                key={t.id}
                to={`/academy/${t.id}`}
                className="rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <t.icon className="h-5 w-5" strokeWidth={2.4} />
                </span>
                <p className="text-sm font-semibold leading-tight">{t.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{t.difficulty}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <AppNav />
    </main>
  );
};

const ProgressRing = ({ percent, label }: { percent: number; label: string }) => {
  const r = 30;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div className="relative h-[76px] w-[76px]">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 76 76">
        <circle cx="38" cy="38" r={r} stroke="hsl(var(--secondary))" strokeWidth="6" fill="none" />
        <motion.circle
          cx="38"
          cy="38"
          r={r}
          stroke="hsl(var(--primary))"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.6))" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">{label}</div>
    </div>
  );
};

export default Home;