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
    className="fixed bottom-0 inset-x-0 z-40 border-t border-white/[0.04] bg-background/90 backdrop-blur-xl"
    style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
  >
    <div className="mx-auto flex max-w-3xl items-stretch justify-around px-3 py-2">
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `group flex min-w-[64px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-[10.5px] font-medium transition-colors ${
              isActive
                ? "text-primary"
                : "text-muted-foreground/80 hover:text-foreground"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                  isActive ? "bg-primary/10" : ""
                }`}
              >
                <Icon className="h-[17px] w-[17px]" strokeWidth={isActive ? 2.4 : 2} />
              </span>
              <span className="leading-none tracking-tight">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);