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
          {renderSide(sideItems)}

          {/* Central elevated dashboard tab */}
          <div className="flex-1 flex justify-center items-start relative">
            <NavLink
              to={centerItem.to}
              aria-label={centerItem.label}
              className="absolute -top-5 flex items-center justify-center rounded-full bg-primary text-white shadow-md p-[14px] transition-transform active:scale-95"
            >
              {/* DOC: size={26} hors grille — onglet central nav, 20% plus grand que les onglets flanquants (spec design) */}
              <centerItem.icon size={26} strokeWidth={2.25} />
            </NavLink>
          </div>

          {renderSide(sideItemsRight)}
        </nav>
      </div>
    </div>
  );
};

export default AppShell;