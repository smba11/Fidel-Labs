import { BookOpen, Library, LogOut, Map, MessageCircle, RotateCcw, Sparkles, UserRound } from "lucide-react";

import type { AppUser, RouteId } from "@/types/learning";

const navItems: { id: RouteId; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Today", icon: <Sparkles size={20} /> },
  { id: "review", label: "Review", icon: <RotateCcw size={20} /> },
  { id: "fidel", label: "Fidel", icon: <BookOpen size={20} /> },
  { id: "conversation", label: "Talk", icon: <MessageCircle size={20} /> },
  { id: "library", label: "Library", icon: <Library size={20} /> },
  { id: "progress", label: "Growth", icon: <Map size={20} /> },
];

export function AppShell({
  children,
  route,
  user,
  onAuth,
  onRoute,
}: {
  children: React.ReactNode;
  route: RouteId;
  user: AppUser | null;
  onAuth: () => void;
  onRoute: (route: RouteId) => void;
}) {
  return (
    <main className="aurora-shell min-h-screen text-white">
      <div className="mx-auto grid min-h-screen w-full max-w-[1560px] gap-5 px-4 py-4 md:grid-cols-[116px_minmax(0,1fr)] md:px-7 md:py-7 xl:gap-8">
        <aside className="fixed bottom-4 left-4 right-4 z-40 rounded-[1.5rem] border border-white/10 bg-[#111]/90 p-2 shadow-2xl shadow-black/30 backdrop-blur md:sticky md:bottom-auto md:top-7 md:flex md:h-[calc(100vh-3.5rem)] md:flex-col md:rounded-[2rem] md:p-3">
          <div className="mb-4 hidden md:flex md:items-center md:justify-center">
            <div aria-label="Fidel Labs" className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] font-[var(--ethiopic)] text-2xl font-black text-[#d6b16a] shadow-lg shadow-black/30">
              ፊ
            </div>
          </div>
          <nav aria-label="Primary navigation" className="grid grid-cols-6 gap-2 md:grid-cols-1 md:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onRoute(item.id)}
                aria-current={route === item.id ? "page" : undefined}
                className={[
                  "grid min-h-16 place-items-center rounded-2xl text-[11px] font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black md:min-h-[68px] md:gap-1 md:text-xs",
                  route === item.id ? "bg-white text-black shadow-lg shadow-white/10" : "text-white/55 hover:bg-white/8 hover:text-white",
                ].join(" ")}
                title={item.label}
              >
                {item.icon}
                <span className="md:text-xs">{item.label}</span>
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={onAuth}
            aria-label={user ? "Sign out" : "Sign in"}
            title={user ? "Sign out" : "Sign in"}
            className="mt-4 hidden rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-white/25 hover:bg-white/10 md:block"
          >
            <div className="mx-auto grid size-12 place-items-center overflow-hidden rounded-2xl bg-white text-black">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="size-full object-cover" />
              ) : user ? (
                user.name.slice(0, 1).toUpperCase()
              ) : (
                <UserRound size={19} />
              )}
            </div>
            <p className="mt-3 truncate text-center text-xs font-black">{user ? "Account" : "Guest"}</p>
            <p className="mt-1 text-center text-[11px] font-bold leading-4 text-white/45">{user ? "Cloud on" : "Sign in"}</p>
          </button>
          <div className="mt-auto hidden border-t border-white/10 pt-3 md:block">
            <button
              type="button"
              onClick={onAuth}
              className="grid min-h-12 w-full place-items-center rounded-2xl text-white/45 transition hover:bg-white/8 hover:text-white"
              aria-label={user ? "Sign out" : "Sign in"}
              title={user ? "Sign out" : "Sign in"}
            >
              {user ? <LogOut size={18} /> : <UserRound size={18} />}
            </button>
          </div>
        </aside>

        <div key={route} className="page-rise min-w-0 pb-24 md:pb-0">
          {children}
        </div>
      </div>
    </main>
  );
}
