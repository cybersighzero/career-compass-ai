import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award, ArrowRight, Bot, CheckCircle2, ShieldCheck, TrendingUp, XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { performanceBreakdown, incorrect, strengths, weaknesses, readiness } from "@/lib/mock-data";
import {
  PieChart, Pie, Cell, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip,
} from "recharts";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your results · PlacePrep AI" },
      { name: "description", content: "Placement readiness score, AI interview feedback and personalized recommendations." },
    ],
  }),
  component: ResultsPage,
});

const pieData = [
  { name: "Correct", value: 82, color: "var(--color-success)" },
  { name: "Partial", value: 12, color: "var(--color-warning)" },
  { name: "Incorrect", value: 6, color: "var(--color-destructive)" },
];

function ResultsPage() {
  return (
    <div className="min-h-screen bg-background page-fade-in">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4">
          <div className="grid size-9 place-items-center rounded-xl bg-success text-success-foreground"><Award className="size-5" /></div>
          <div className="flex-1">
            <div className="text-sm font-semibold tracking-tight">Assessment complete</div>
            <div className="text-xs text-muted-foreground">Reviewed by PlacePrep AI · session finalized just now</div>
          </div>
          <Button asChild><Link to="/dashboard">Go to dashboard <ArrowRight className="size-4" /></Link></Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="card-surface p-6 md:col-span-1">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Overall readiness</div>
            <div className="mt-3 flex items-end gap-2">
              <div className="text-5xl font-semibold tracking-tight">{readiness.overall}</div>
              <div className="pb-2 text-sm text-muted-foreground">/ 100</div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <Badge className="bg-success/15 text-success border border-success/20">Placement Ready</Badge>
              <span className="text-muted-foreground inline-flex items-center gap-1"><TrendingUp className="size-3" /> +6 vs. last attempt</span>
            </div>
            <div className="mt-6 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-chart-2" style={{ width: `${readiness.overall}%` }} />
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              You're tracking well ahead of your cohort's median (64). Focus your remaining prep on distributed systems and behavioral depth to reach the top decile.
            </p>
          </div>
          <div className="card-surface p-6">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Quiz score</div>
            <div className="mt-3 text-4xl font-semibold tracking-tight">{readiness.quiz}<span className="text-base text-muted-foreground">/100</span></div>
            <div className="mt-4 space-y-1.5">
              {[["DSA", 88], ["Databases", 76], ["OS & Networks", 72]].map(([k, v]) => (
                <Row key={k as string} k={k as string} v={v as number} />
              ))}
            </div>
          </div>
          <div className="card-surface p-6">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Interview score</div>
            <div className="mt-3 text-4xl font-semibold tracking-tight">{readiness.interview}<span className="text-base text-muted-foreground">/100</span></div>
            <div className="mt-4 space-y-1.5">
              {[["Clarity", 82], ["Depth", 68], ["Structure", 74]].map(([k, v]) => (
                <Row key={k as string} k={k as string} v={v as number} />
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="card-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Answer distribution</div>
                <div className="text-xs text-muted-foreground">Across the 20 subjective quiz responses.</div>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_1fr] items-center gap-4">
              <div className="h-52">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} innerRadius={54} outerRadius={80} dataKey="value" paddingAngle={2}>
                      {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 text-sm">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: d.color }} /> {d.name}</div>
                    <span className="font-medium">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card-surface p-6">
            <div className="mb-4">
              <div className="text-sm font-semibold">Performance breakdown</div>
              <div className="text-xs text-muted-foreground">Weighted across topics evaluated in your assessment.</div>
            </div>
            <div className="h-52">
              <ResponsiveContainer>
                <RadarChart data={performanceBreakdown}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.25} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="card-surface p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="grid size-8 place-items-center rounded-lg bg-success/15 text-success"><CheckCircle2 className="size-4" /></div>
              <div className="text-sm font-semibold">Strengths</div>
            </div>
            <ul className="space-y-2 text-sm text-foreground/80">
              {strengths.map((s) => <li key={s} className="flex gap-2"><span className="mt-2 size-1.5 rounded-full bg-success shrink-0" /> {s}</li>)}
            </ul>
          </div>
          <div className="card-surface p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="grid size-8 place-items-center rounded-lg bg-warning/15 text-warning-foreground"><XCircle className="size-4" /></div>
              <div className="text-sm font-semibold">Weaknesses</div>
            </div>
            <ul className="space-y-2 text-sm text-foreground/80">
              {weaknesses.map((s) => <li key={s} className="flex gap-2"><span className="mt-2 size-1.5 rounded-full bg-warning shrink-0" /> {s}</li>)}
            </ul>
          </div>
        </section>

        <section className="card-surface p-6">
          <div className="mb-4">
            <div className="text-sm font-semibold">Question review</div>
            <div className="text-xs text-muted-foreground">Your incorrect answers with a suggested reference explanation.</div>
          </div>
          <div className="space-y-4">
            {incorrect.map((q, i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <div className="text-sm font-medium">{q.q}</div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-3">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-destructive mb-1">Your answer</div>
                    <div className="text-sm text-foreground/80">{q.given}</div>
                  </div>
                  <div className="rounded-lg border border-success/25 bg-success/5 p-3">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-success mb-1">Reference answer</div>
                    <div className="text-sm text-foreground/80">{q.correct}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="card-surface p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary"><Bot className="size-4" /></div>
              <div className="text-sm font-semibold">AI interviewer feedback</div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Aarav communicated with confidence and structured most answers around requirement gathering before diving into design. Depth on distributed
              systems concepts (consensus, quorum, replication topologies) is the primary area for growth. Behavioral answers were authentic but rarely closed
              with quantified impact. Pacing was strong throughout — allocated time was used efficiently.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[["Clarity", 8.2], ["Depth", 6.8], ["Structure", 7.4]].map(([k, v]) => (
                <div key={k as string} className="rounded-lg border border-border p-3">
                  <div className="text-xl font-semibold">{v}</div>
                  <div className="text-xs text-muted-foreground">{k}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card-surface p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="grid size-8 place-items-center rounded-lg bg-success/15 text-success"><ShieldCheck className="size-4" /></div>
              <div className="text-sm font-semibold">Integrity check</div>
            </div>
            <div className="text-3xl font-semibold tracking-tight">Low risk</div>
            <div className="text-xs text-muted-foreground mt-1">Cheating probability · 3.2%</div>
            <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              <li>· No tab switching detected during session</li>
              <li>· Typing cadence consistent with baseline</li>
              <li>· Camera & mic checks nominal</li>
            </ul>
          </div>
        </section>

        <section className="card-surface p-6">
          <div className="mb-4">
            <div className="text-sm font-semibold">Recommendations</div>
            <div className="text-xs text-muted-foreground">Curated next steps to lift your readiness by an estimated +12 points.</div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { t: "Deep-dive: Distributed systems", d: "3-week focused sprint covering CAP, consensus, replication, and quorum reads.", cta: "Open roadmap" },
              { t: "Behavioral polish", d: "Rewrite three STAR-format answers with quantified outcomes.", cta: "See templates" },
              { t: "Book two mock interviews", d: "Alternate technical and behavioral to reinforce structure under pressure.", cta: "Schedule" },
            ].map((r) => (
              <div key={r.t} className="rounded-xl border border-border p-4 card-hover">
                <div className="text-sm font-medium">{r.t}</div>
                <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{r.d}</div>
                <Button variant="ghost" size="sm" className="mt-3 -ml-3 text-primary">{r.cta} <ArrowRight className="size-4" /></Button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Row({ k, v }: { k: string; v: number }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="w-28 text-muted-foreground">{k}</div>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${v}%` }} />
      </div>
      <div className="w-8 text-right font-medium">{v}</div>
    </div>
  );
}
