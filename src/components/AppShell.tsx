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
            "flex-1 flex flex-col items-center justify-center gap-1 transition-colors",
            isActive ? "text-primary" : "text-foreground/50"
          )
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              size={22}
              strokeWidth={isActive ? 2.25 : 2}
              fill={isActive ? "currentColor" : "none"}
            />
            <span className={cn("text-[10px]", isActive ? "font-semibold" : "font-medium")}>
              {label}
            </span>
          </>
        )}
      </NavLink>
    ));

  return (
    <div className="min-h-screen w-full flex justify-center text-white">
      <div className="relative w-full max-w-[390px] min-h-screen flex flex-col">
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
          {renderSide(sideItems)}

          {/* Central elevated dashboard tab */}
          <div className="flex-1 flex justify-center items-start relative">
            <NavLink
              to={centerItem.to}
              aria-label={centerItem.label}
              className="absolute -top-2 flex flex-col items-center justify-center rounded-full bg-primary text-white shadow-md px-3 pt-2 pb-1.5 transition-transform active:scale-95 gap-0.5"
            >
              <centerItem.icon size={22} strokeWidth={2.25} />
              <span className="text-[9px] font-semibold leading-none">{centerItem.label}</span>
            </NavLink>
          </div>

          {renderSide(sideItemsRight)}
        </nav>
      </div>
    </div>
  );
};

export default AppShell;