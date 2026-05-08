import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppNav } from "@/components/AppNav";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { TOPICS } from "@/lib/topics";
import { levelProgress } from "@/lib/xp";
import { ArrowRight, Brain, Wrench, Target, Sparkles, Flame, Clock, Rocket } from "lucide-react";

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
      <div className="mx-auto max-w-2xl px-5 pt-10">
        <header className="mb-7 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">Welcome back</p>
            <h1 className="mt-1 text-[26px] font-bold tracking-tight">Hi, {stats.displayName}</h1>
            <p className="mt-1 text-[13px] text-muted-foreground flex items-center gap-1.5">
              <Rocket className="h-3.5 w-3.5 text-primary/80" />
              {stats.completed > 0
                ? `You're improving fast — ${stats.completed} lesson${stats.completed === 1 ? "" : "s"} done`
                : "Let's start your first lesson today"}
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.05] bg-card/70 px-3 py-1.5 text-[13px]">
            <Flame className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold">{stats.totalXp}</span>
            <span className="text-muted-foreground">XP</span>
          </div>
        </header>

        {/* Continue learning — dominant hero */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-7"
        >
          <p className="mb-2.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
            Continue learning
          </p>
          <Link
            to={`/academy/${resumeTopic.id}`}
            className="group block surface-card surface-card-hover p-6 relative overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(135deg, hsl(var(--primary) / 0.06), hsl(var(--card)) 60%)",
            }}
          >
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <resumeTopic.icon className="h-6 w-6" strokeWidth={2.2} />
              </span>
              <div className="flex-1 min-w-0">
                <h2 className="text-[19px] font-semibold tracking-tight">{resumeTopic.title}</h2>
                <p className="mt-1 text-[13px] text-muted-foreground line-clamp-1">
                  Next: {resumeTopic.description}
                </p>

                <div className="mt-4 flex items-center justify-between text-[12px]">
                  <span className="font-medium text-foreground/90">68% completed</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" /> ~5 min remaining
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "68%" }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="h-full rounded-full bg-primary glow-primary-soft"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end text-[13px] font-medium text-primary">
              Resume lesson
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </motion.div>

        {/* Daily progress */}
        <section className="mb-7 surface-card p-5">
          <div className="flex items-center gap-4">
            <ProgressRing percent={lvl.percent} label={`L${lvl.level}`} />
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
                Daily goal
              </p>
              <p className="mt-0.5 text-[15px] font-semibold tracking-tight">
                {lvl.span - lvl.into} XP to Level {lvl.level + 1}
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                {stats.completed} lessons · {stats.achievements} achievements
              </p>
            </div>
          </div>
        </section>

        {/* Recommended */}
        <section className="mb-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary/80" /> Recommended for you
            </h2>
            <Link to="/academy" className="text-[12px] text-muted-foreground hover:text-foreground">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recommended.map((t) => (
              <Link
                key={t.id}
                to={`/academy/${t.id}`}
                className="surface-card surface-card-hover p-4"
              >
                <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <t.icon size={18} strokeWidth={2.2} />
                </span>
                <p className="text-[14px] font-semibold leading-tight tracking-tight">{t.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{t.difficulty}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick tools */}
        <section className="mb-2">
          <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
            Quick actions
          </p>
          <div className="grid grid-cols-3 gap-3">
          {[
            { to: "/explain", icon: Brain, label: "Explain" },
            { to: "/refine", icon: Wrench, label: "Refine" },
            { to: "/challenges", icon: Target, label: "Practice" },
          ].map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className="surface-card surface-card-hover flex flex-col items-center gap-2 p-3 text-[12px] font-medium"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/8 text-primary">
                <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </span>
              {label}
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
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div className="relative h-[72px] w-[72px]">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} stroke="hsl(0 0% 100% / 0.06)" strokeWidth="5" fill="none" />
        <motion.circle
          cx="36"
          cy="36"
          r={r}
          stroke="hsl(var(--primary))"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 4px hsl(var(--primary) / 0.45))" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold tracking-tight">
        {label}
      </div>
    </div>
  );
};

export default Home;