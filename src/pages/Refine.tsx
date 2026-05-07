import { AppNav } from "@/components/AppNav";
import { Wrench } from "lucide-react";

const Refine = () => (
  <main className="min-h-screen bg-background text-foreground pb-24">
    <AppNav />
    <div className="mx-auto max-w-2xl px-5 py-16 text-center">
      <div
        className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[28%] bg-primary text-primary-foreground"
        style={{
          boxShadow:
            "0 0 60px 0 hsl(var(--primary) / 0.55), 0 0 120px 10px hsl(var(--primary) / 0.25)",
        }}
        aria-hidden
      >
        <Wrench className="h-10 w-10" strokeWidth={2.5} />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight">Refine Code</h1>
      <p className="mt-3 text-muted-foreground">
        Polish, optimize, and clean up your code. Coming soon.
      </p>
    </div>
  </main>
);

export default Refine;