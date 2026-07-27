import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Map, ClipboardList, Video, Trophy, Settings,
  LogOut, GraduationCap, ChevronRight, Bell, Search,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brand, mockStudent } from "@/lib/mock-data";

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/roadmap", label: "Roadmap", icon: Map },
  { to: "/dashboard/quiz-history", label: "Quiz History", icon: ClipboardList },
  { to: "/dashboard/interview-history", label: "Interview History", icon: Video },
  { to: "/dashboard/results", label: "Results", icon: Trophy },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function StudentShell({ children, title, subtitle, actions }: {
  children: ReactNode; title: string; subtitle?: string; actions?: ReactNode;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="flex items-center gap-2 px-6 py-5">
          <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">{brand.name}</div>
            <div className="text-[11px] text-muted-foreground">{brand.tagline}</div>
          </div>
        </div>
        <nav className="mt-2 flex-1 space-y-1 px-3">
          {nav.map((n) => {
            const active = path === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to} to={n.to}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="size-4" />
                <span>{n.label}</span>
                {active && <ChevronRight className="ml-auto size-4 opacity-60" />}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <div className="grid size-9 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-semibold">
              {mockStudent.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{mockStudent.name}</div>
              <div className="truncate text-[11px] text-muted-foreground">{mockStudent.regNo}</div>
            </div>
            <Link to="/" aria-label="Log out" className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
              <LogOut className="size-4" />
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background/80 backdrop-blur px-6 py-4">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="hidden md:flex relative w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search…" className="pl-9 bg-surface" />
          </div>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
          {actions}
        </header>
        <main className="flex-1 page-fade-in px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
