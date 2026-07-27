import { createFileRoute, Link } from "@tanstack/react-router";
import { StudentShell } from "@/components/layout/StudentShell";
import { StatCard } from "@/components/StatCard";
import { Award, Flame, Play, Sparkles, Target, Trophy, Video, Map as MapIcon } from "lucide-react";
import { activity, mockStudent, readiness, readinessTrend } from "@/lib/mock-data";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Overview · PlacePrep AI" },
      { name: "description", content: "Your placement readiness overview — scores, activity and next actions." },
    ],
  }),
  component: DashboardHome,
});

function DashboardHome() {
  return (
    <StudentShell title={`Welcome, ${mockStudent.name.split(" ")[0]}`} subtitle="Here's a snapshot of your placement readiness.">
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-4">
          <StatCard label="Readiness score" value={`${readiness.overall}/100`} delta="+6 this week" icon={<Trophy className="size-4" />} />
          <StatCard label="Quiz score" value={`${readiness.quiz}/100`} delta="Above cohort median" icon={<Award className="size-4" />} />
          <StatCard label="Interview score" value={`${readiness.interview}/100`} delta="Clarity strong" icon={<Video className="size-4" />} />
          <StatCard label="Streak" value="12 days" delta="Keep it going" icon={<Flame className="size-4" />} />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="card-surface p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Readiness trend</div>
                <div className="text-xs text-muted-foreground">Weekly composite score across quizzes and interviews.</div>
              </div>
              <Badge variant="secondary">Last 7 weeks</Badge>
            </div>
            <div className="h-60">
              <ResponsiveContainer>
                <AreaChart data={readinessTrend} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", fontSize: 12 }} />
                  <Area type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#rg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-surface p-6">
            <div className="text-sm font-semibold">Skill progress</div>
            <div className="text-xs text-muted-foreground">Movement since last month.</div>
            <div className="mt-4 space-y-3.5">
              {[
                { s: "DSA", v: 86, up: "+8" },
                { s: "System Design", v: 62, up: "+14" },
                { s: "Databases", v: 74, up: "+4" },
                { s: "Communication", v: 82, up: "+3" },
              ].map((r) => (
                <div key={r.s}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{r.s}</span>
                    <span className="text-success">{r.up}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${r.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="card-surface p-6 lg:col-span-2">
            <div className="text-sm font-semibold">Recent activity</div>
            <div className="text-xs text-muted-foreground">Auto-tracked across your sessions.</div>
            <ul className="mt-4 divide-y divide-border">
              {activity.map((a) => (
                <li key={a.text} className="flex items-center gap-3 py-3">
                  <div className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary"><Sparkles className="size-4" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm">{a.text}</div>
                    <div className="text-xs text-muted-foreground">{a.when}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-surface p-6">
            <div className="text-sm font-semibold">Quick actions</div>
            <div className="mt-4 grid gap-2">
              <Button asChild variant="outline" className="justify-start"><Link to="/quiz"><Play className="size-4" /> Start new assessment</Link></Button>
              <Button asChild variant="outline" className="justify-start"><Link to="/interview"><Video className="size-4" /> Practice AI interview</Link></Button>
              <Button asChild variant="outline" className="justify-start"><Link to="/dashboard/roadmap"><MapIcon className="size-4" /> Open my roadmap</Link></Button>
              <Button asChild variant="outline" className="justify-start"><Link to="/results"><Trophy className="size-4" /> Review last results</Link></Button>
            </div>
            <div className="mt-6 rounded-xl border border-border bg-primary-soft p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-accent-foreground"><Target className="size-4" /> Next milestone</div>
              <p className="mt-1 text-xs text-accent-foreground/80">Reach 85 readiness by shipping one system-design project and clearing two mock interviews.</p>
            </div>
          </div>
        </section>
      </div>
    </StudentShell>
  );
}
