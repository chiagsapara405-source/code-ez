import { useEffect, useState } from "react";
import { AppNav } from "@/components/AppNav";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { levelProgress } from "@/lib/xp";
import { Button } from "@/components/ui/button";
import * as Lucide from "lucide-react";
import { LogOut, Trophy } from "lucide-react";

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
};

const Profile = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<{ display_name: string | null; total_xp: number } | null>(null);
  const [completed, setCompleted] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: prof }, { data: prog }, { count: attemptCount }, { data: ach }, { data: ua }] = await Promise.all([
        supabase.from("profiles").select("display_name,total_xp").eq("user_id", user.id).maybeSingle(),
        supabase.from("user_progress").select("completed").eq("user_id", user.id),
        supabase.from("practice_attempts").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("achievements").select("*"),
        supabase.from("user_achievements").select("achievement_id").eq("user_id", user.id),
      ]);
      setProfile(prof ?? { display_name: null, total_xp: 0 });
      setCompleted((prog ?? []).filter((p) => p.completed).length);
      setAttempts(attemptCount ?? 0);
      setAchievements((ach ?? []) as Achievement[]);
      setUnlocked(new Set((ua ?? []).map((u) => u.achievement_id)));
    })();
  }, [user]);

  const lvl = levelProgress(profile?.total_xp ?? 0);

  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      <div className="mx-auto max-w-2xl px-5 pt-10">
        <header className="mb-7 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary text-2xl font-semibold">
            {(profile?.display_name ?? user?.email ?? "U")[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-[20px] font-bold tracking-tight">
              {profile?.display_name ?? "Learner"}
            </h1>
            <p className="text-[12px] text-muted-foreground">{user?.email}</p>
          </div>
          <Button size="icon" variant="ghost" onClick={signOut} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <section className="mb-6 grid grid-cols-3 gap-3">
          <Stat label="Level" value={lvl.level} />
          <Stat label="Total XP" value={profile?.total_xp ?? 0} />
          <Stat label="Lessons" value={completed} />
        </section>

        <section className="mb-7 surface-card p-6">
          <div className="mb-3 flex items-center justify-between text-[13.5px]">
            <span className="font-semibold tracking-tight">Level {lvl.level}</span>
            <span className="text-muted-foreground">
              {lvl.into} / {lvl.span} XP
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full bg-primary glow-primary-soft transition-all duration-700"
              style={{
                width: `${lvl.percent}%`,
              }}
            />
          </div>
          <p className="mt-3 text-[12px] text-muted-foreground">
            {attempts} practice sessions · keep going, you're {lvl.span - lvl.into} XP from Level {lvl.level + 1}
          </p>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
            <Trophy className="h-3 w-3 text-primary/80" /> Achievements
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((a) => {
              const Icon = (Lucide as any)[a.icon] ?? Lucide.Award;
              const isUnlocked = unlocked.has(a.id);
              return (
                <div
                  key={a.id}
                  className={`surface-card p-4 transition-all ${
                    isUnlocked ? "glow-primary-soft" : "opacity-55"
                  }`}
                >
                  <span
                    className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl ${
                      isUnlocked ? "bg-primary/15 text-primary" : "bg-white/[0.04] text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                  </span>
                  <p className="text-[13.5px] font-semibold leading-tight tracking-tight">{a.title}</p>
                  <p className="mt-1 text-[11.5px] text-muted-foreground leading-relaxed">{a.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <AppNav />
    </main>
  );
};

const Stat = ({ label, value }: { label: string; value: number | string }) => (
  <div className="surface-card p-4 text-center">
    <p className="text-[20px] font-bold tracking-tight text-foreground">{value}</p>
    <p className="mt-0.5 text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
  </div>
);

export default Profile;