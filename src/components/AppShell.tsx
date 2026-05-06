import { NavLink, Outlet } from "react-router-dom";
import { Calendar, Sun, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/semaine", label: "Semaine", icon: Calendar },
  { to: "/aujourd-hui", label: "Aujourd'hui", icon: Sun },
  { to: "/epicerie", label: "Épicerie", icon: ShoppingBag },
  { to: "/profil", label: "Profil", icon: User },
];

const AppShell = () => {
  return (
    <div className="min-h-screen w-full bg-background flex justify-center">
      <div className="relative w-full max-w-[390px] min-h-screen bg-background flex flex-col">
        <div
          className="shrink-0"
          style={{ height: "max(env(safe-area-inset-top), 44px)" }}
          aria-hidden
        />
        <main className="flex-1" style={{ paddingBottom: "calc(64px + env(safe-area-inset-bottom))" }}>
          <Outlet />
        </main>
        <nav
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-border flex items-stretch z-50"
          style={{ paddingBottom: "env(safe-area-inset-bottom)", height: "calc(64px + env(safe-area-inset-bottom))" }}
          aria-label="Navigation principale"
        >
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 transition-colors",
                  isActive ? "text-[#A8C5BC]" : "text-[#2A2D35]/40"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={2} />
                  <span className={cn("text-[11px]", isActive ? "font-semibold" : "font-medium")}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AppShell;