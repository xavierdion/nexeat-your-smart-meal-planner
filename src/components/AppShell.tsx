import { NavLink, Outlet } from "react-router-dom";
import { Calendar, Sun, ShoppingBag, User, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const sideItems = [
  { to: "/semaine", label: "Semaine", icon: Calendar },
  { to: "/epicerie", label: "Épicerie", icon: ShoppingBag },
] as const;

const sideItemsRight = [
  { to: "/recettes", label: "Recettes", icon: BookOpen },
  { to: "/profil", label: "Profil", icon: User },
] as const;

const centerItem = { to: "/aujourd-hui", label: "Aujourd'hui", icon: Sun };

const AppShell = () => {
  const renderSide = (items: ReadonlyArray<{ to: string; label: string; icon: typeof Calendar }>) =>
    items.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          cn(
            "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 ease-out min-h-[44px] min-w-[44px] rounded-full",
            isActive
              ? "text-primary bg-secondary/40 px-3.5 py-2"
              : "text-foreground/60"
          )
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              size={22}
              strokeWidth={isActive ? 2.25 : 2}
            />
            <span className={cn("text-[10px]", isActive ? "font-semibold" : "font-medium")}>
              {label}
            </span>
          </>
        )}
      </NavLink>
    ));

  return (
    <div className="min-h-screen w-full bg-background flex justify-center">
      <div className="relative w-full max-w-[390px] min-h-screen bg-background flex flex-col">
        <div
          className="shrink-0"
          style={{ height: "max(env(safe-area-inset-top), 44px)" }}
          aria-hidden
        />
        <main className="flex-1" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}>
          <Outlet />
        </main>
        <nav
          className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[358px] bg-white rounded-full shadow-float flex items-center z-50 px-3 py-2"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}
          aria-label="Navigation principale"
          role="navigation"
        >
          {renderSide(sideItems)}

          {/* Central elevated dashboard tab */}
          <div className="flex-1 flex justify-center items-center relative">
            <NavLink
              to={centerItem.to}
              aria-label={centerItem.label}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center rounded-full px-3 pt-2 pb-1.5 transition-all duration-200 ease-out gap-0.5 min-h-[44px] min-w-[44px]",
                  isActive
                    ? "bg-primary text-white shadow-float"
                    : "bg-secondary/40 text-foreground/60"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <centerItem.icon size={22} strokeWidth={isActive ? 2.25 : 2} />
                  <span className="text-[9px] font-semibold leading-none">{centerItem.label}</span>
                </>
              )}
            </NavLink>
          </div>

          {renderSide(sideItemsRight)}
        </nav>
      </div>
    </div>
  );
};

export default AppShell;