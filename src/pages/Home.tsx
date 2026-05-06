import { Link } from "react-router-dom";
import { AppNav } from "@/components/AppNav";
import { Brain, Wrench, GraduationCap, Code2, ArrowRight } from "lucide-react";

const features = [
  {
    to: "/explain",
    title: "Explain Code",
    desc: "Paste any snippet and get a clear, exam-focused breakdown.",
    icon: Brain,
  },
  {
    to: "/refine",
    title: "Refine Code",
    desc: "Polish, fix, and improve your code with AI suggestions.",
    icon: Wrench,
  },
  {
    to: "/academy",
    title: "Practice Academy",
    desc: "Learn topics step-by-step with Buddy, your AI mentor.",
    icon: GraduationCap,
  },
];

const Home = () => (
  <main className="min-h-screen bg-background text-foreground">
    <AppNav />
    <div className="mx-auto max-w-2xl px-5 py-10">
      <header className="mb-10 flex flex-col items-center text-center">
        <div
          className="mb-5 flex h-20 w-20 items-center justify-center rounded-[28%] bg-primary text-primary-foreground"
          style={{
            boxShadow:
              "0 0 60px 0 hsl(var(--primary) / 0.55), 0 0 120px 10px hsl(var(--primary) / 0.25)",
          }}
          aria-hidden
        >
          <Code2 className="h-10 w-10" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight">CodeBuddy</h1>
        <p className="mt-3 text-muted-foreground">
          Understand code. Refine it. Master it.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {features.map(({ to, title, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent/40"
          >
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-[28%] bg-primary text-primary-foreground"
              style={{
                boxShadow:
                  "0 0 18px 0 hsl(var(--primary) / 0.45), 0 0 36px 4px hsl(var(--primary) / 0.18)",
              }}
              aria-hidden
            >
              <Icon className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
          </Link>
        ))}
      </section>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Powered by AI · Beginner-friendly explanations
      </p>
    </div>
  </main>
);

export default Home;