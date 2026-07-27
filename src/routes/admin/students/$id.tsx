import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AdminShell } from "@/components/layout/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { students, performanceBreakdown, readinessTrend, roadmap } from "@/lib/mock-data";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

export const Route = createFileRoute("/admin/students/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Student ${params.id} · PlacePrep Admin` },
      { name: "description", content: "Detailed student profile — academic record, assessment results and roadmap." },
    ],
  }),
  loader: ({ params }) => {
    const s = students.find((x) => x.id === params.id);
    if (!s) throw notFound();
    return { student: s };
  },
  notFoundComponent: () => (
    <AdminShell title="Student not found" subtitle="This profile may have been removed.">
      <Button asChild variant="outline"><Link to="/admin/students"><ArrowLeft className="size-4" /> Back to students</Link></Button>
    </AdminShell>
  ),
  component: StudentProfile,
});

function StudentProfile() {
  const { student } = Route.useLoaderData();
  return (
    <AdminShell title={student.name} subtitle={`${student.regNo} · ${student.dept} · Target: ${student.role}`} actions={
      <Button asChild variant="outline" size="sm"><Link to="/admin/students"><ArrowLeft className="size-4" /> Back</Link></Button>
    }>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-surface p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground text-lg font-semibold">
              {student.name.split(" ").map((x: string) => x[0]).slice(0, 2).join("")}
            </div>
            <div>
              <div className="text-lg font-semibold">{student.name}</div>
              <div className="text-xs text-muted-foreground">{student.regNo}</div>
            </div>
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            <Row k="Department" v={student.dept} />
            <Row k="Current CGPA" v={student.cgpa} />
            <Row k="Target role" v={student.role} />
            <Row k="Readiness" v={`${student.readiness}/100`} />
            <Row k="Status" v={<Badge className={
              student.status === "Ready" ? "bg-success/15 text-success border border-success/20"
              : student.status === "On Track" ? "bg-primary-soft text-primary border border-primary/20"
              : "bg-warning/15 text-warning-foreground border border-warning/30"
            }>{student.status}</Badge>} />
          </dl>
        </div>

        <div className="card-surface p-6 lg:col-span-2">
          <div className="text-sm font-semibold">Readiness trend</div>
          <div className="text-xs text-muted-foreground">Weekly composite score.</div>
          <div className="mt-4 h-52">
            <ResponsiveContainer>
              <AreaChart data={readinessTrend} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="rg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", fontSize: 12 }} />
                <Area type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#rg2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-6">
          <div className="text-sm font-semibold">Assessment breakdown</div>
          <div className="text-xs text-muted-foreground">Latest quiz + interview results.</div>
          <div className="h-56 mt-3">
            <ResponsiveContainer>
              <RadarChart data={performanceBreakdown}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <Radar dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.25} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary"><Sparkles className="size-4" /></div>
            <div className="text-sm font-semibold">AI improvement suggestions</div>
          </div>
          <ul className="space-y-2 text-sm text-foreground/85">
            {roadmap.technical.map((t) => (
              <li key={t} className="flex gap-2"><span className="mt-2 size-1.5 rounded-full bg-primary shrink-0" /> {t}</li>
            ))}
          </ul>
        </div>

        <div className="card-surface p-6 lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="grid size-8 place-items-center rounded-lg bg-success/15 text-success"><ShieldCheck className="size-4" /></div>
            <div className="text-sm font-semibold">AI placement prediction</div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Prediction label="Offer probability" value="82%" note="Within current cycle" />
            <Prediction label="Best-fit companies" value="Northwind · Vector Labs" note="Based on skills + preferences" />
            <Prediction label="Recommended focus" value="System Design · Behavioral" note="Highest leverage areas" />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className="text-sm font-medium">{v}</dd>
    </div>
  );
}
function Prediction({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{note}</div>
    </div>
  );
}
