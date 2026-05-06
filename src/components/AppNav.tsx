import { NavLink } from "react-router-dom";
import { Home, Brain, Wrench, GraduationCap } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/explain", label: "Explain Code", icon: Brain },
  { to: "/refine", label: "Refine Code", icon: Wrench },
  { to: "/academy", label: "Practice Academy", icon: GraduationCap },
];

export const AppNav = () => (
  <nav className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
    <div className="mx-auto flex max-w-3xl items-center gap-1 px-3 py-2 overflow-x-auto">
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm whitespace-nowrap transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </div>
  </nav>
);