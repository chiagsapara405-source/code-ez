import { NavLink } from "react-router-dom";
import { Home, GraduationCap, Bot, Target, User } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/academy", label: "Learn", icon: GraduationCap },
  { to: "/mentor", label: "Mentor", icon: Bot },
  { to: "/challenges", label: "Challenges", icon: Target },
  { to: "/profile", label: "Profile", icon: User },
];

export const AppNav = () => (
  <nav
    className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl"
    style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
  >
    <div className="mx-auto flex max-w-3xl items-stretch justify-around px-2 py-1.5">
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `group flex min-w-[60px] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-all ${
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                  isActive ? "bg-primary/15 scale-105" : ""
                }`}
                style={
                  isActive
                    ? { boxShadow: "0 0 18px 0 hsl(var(--primary) / 0.45)" }
                    : undefined
                }
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2.4} />
              </span>
              <span className="leading-none">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);