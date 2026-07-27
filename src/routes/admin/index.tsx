import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/layout/AdminShell";
import { StatCard } from "@/components/StatCard";
import { Building2, GraduationCap, Sparkles, Target, TrendingUp, Users } from "lucide-react";
import { placementTrend, skillGap, students } from "@/lib/mock-data";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin dashboard · PlacePrep AI" },
      { name: "description", content: "Placement cell overview — student readiness, hiring trends and skill gaps." },
    ],
  }),
  component: AdminHome,
});

function AdminHome() {
  const avgReadiness = Math.round(students.reduce((a, s) => a + s.readiness, 0) / students.length);
  return (
    <AdminShell title="Placement dashboard" subtitle="Real-time snapshot of the batch's placement readiness.">
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-4">
          <StatCard label="Registered students" value={students.length} delta="+12 this month" icon={<Users className="size-4" />} />
          <StatCard label="Avg readiness" value={`${avgReadiness}/100`} delta="+4 vs. last month" icon={<Target className="size-4" />} />
          <StatCard label="Hiring companies" value={18} delta="6 actively hiring" icon={<Building2 className="size-4" />} />
          <StatCard label="Offers this cycle" value={88} delta="Trending up" icon={<TrendingUp className="size-4" />} />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="card-surface p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Placement trend</div>
                <div className="text-xs text-muted-foreground">Offers extended per month, current cycle.</div>
              </div>
              <Badge variant="secondary">2026 cycle</Badge>
            </div>
            <div className="h-60">
              <ResponsiveContainer>
                <LineChart data={placementTrend} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", fontSize: 12 }} />
                  <Line type="monotone" dataKey="offers" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-surface p-6">
            <div className="text-sm font-semibold">Skill gap summary</div>
            <div className="text-xs text-muted-foreground">Cohort mastery vs. role requirement.</div>
            <div className="mt-4 space-y-3.5">
              {skillGap.map((r) => (
                <div key={r.skill}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{r.skill}</span>
                    <span className="text-muted-foreground tabular-nums">{r.have} / {r.need}</span>
                  </div>
                  <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-primary" style={{ width: `${r.have}%` }} />
                    <div className="absolute inset-y-0 left-0 border-r-2 border-warning" style={{ width: `${r.need}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Recent student activity</div>
              <div className="text-xs text-muted-foreground">Latest sessions completed across the batch.</div>
            </div>
            <Link to="/admin/students" className="text-xs text-primary hover:underline">View all students →</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {students.slice(0, 6).map((s) => (
              <Link key={s.id} to="/admin/students/$id" params={{ id: s.id }} className="rounded-xl border border-border p-4 card-hover flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                  {s.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{s.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{s.role}</div>
                </div>
                <Badge className={
                  s.status === "Ready" ? "bg-success/15 text-success border border-success/20"
                  : s.status === "On Track" ? "bg-primary-soft text-primary border border-primary/20"
                  : "bg-warning/15 text-warning-foreground border border-warning/30"
                }>{s.readiness}</Badge>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
