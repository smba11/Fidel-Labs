import { BookOpen, Library, Map, MessageCircle, Sparkles, UserRound } from "lucide-react";

import type { AppUser, RouteId } from "@/types/learning";

const navItems: { id: RouteId; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Today", icon: <Sparkles size={20} /> },
  { id: "fidel", label: "Fidel", icon: <BookOpen size={20} /> },
  { id: "conversation", label: "Talk", icon: <MessageCircle size={20} /> },
  { id: "library", label: "Library", icon: <Library size={20} /> },
  { id: "progress", label: "Path", icon: <Map size={20} /> },
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
    <main className="min-h-screen bg-[#f7f7f4] text-black">
      <div className="mx-auto grid min-h-screen w-full max-w-[1560px] gap-5 px-4 py-4 md:grid-cols-[88px_minmax(0,1fr)] md:px-7 md:py-7 xl:gap-8">
        <aside className="fixed bottom-4 left-4 right-4 z-40 rounded-[1.5rem] border border-black/10 bg-white/92 p-2 shadow-2xl shadow-black/10 backdrop-blur md:sticky md:bottom-auto md:top-7 md:self-start md:rounded-[2rem] md:p-2">
          <nav aria-label="Primary navigation" className="grid grid-cols-5 gap-2 md:grid-cols-1 md:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onRoute(item.id)}
                aria-current={route === item.id ? "page" : undefined}
                className={[
                  "grid min-h-16 place-items-center rounded-2xl text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black md:size-16 md:min-h-0 md:gap-1",
                  route === item.id ? "bg-black text-white" : "text-black/55 hover:bg-black/5 hover:text-black",
                ].join(" ")}
                title={item.label}
              >
                {item.icon}
                <span className="md:text-[10px]">{item.label}</span>
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={onAuth}
            aria-label={user ? "Sign out" : "Sign in"}
            title={user ? "Sign out" : "Sign in"}
            className="mt-2 hidden size-16 place-items-center rounded-2xl border border-black/10 transition hover:border-black hover:bg-black/5 md:grid"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="size-10 rounded-xl object-cover" />
            ) : (
              <div className="grid size-10 place-items-center rounded-xl bg-black text-white">
                {user ? user.name.slice(0, 1).toUpperCase() : <UserRound size={18} />}
              </div>
            )}
            <span className="sr-only">{user ? user.name : "Guest learner"}</span>
          </button>
        </aside>

        <div className="min-w-0 pb-24 md:pb-0">{children}</div>
      </div>
    </main>
  );
}
