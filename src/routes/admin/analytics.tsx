import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/layout/AdminShell";
import { placementTrend, roleDistribution, skillGap, students } from "@/lib/mock-data";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from "recharts";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics · PlacePrep Admin" },
      { name: "description", content: "Cohort analytics — role distribution, skill gaps, placement trends." },
    ],
  }),
  component: AnalyticsPage,
});

const colors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)", "var(--color-primary)"];

function AnalyticsPage() {
  const avg = Math.round(students.reduce((a, s) => a + s.readiness, 0) / students.length);
  return (
    <AdminShell title="Analytics" subtitle="How your batch is trending across roles, skills and outcomes.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Role distribution" subtitle="Preferred target role across the batch.">
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={roleDistribution} innerRadius={50} outerRadius={90} dataKey="value" paddingAngle={2}>
                  {roleDistribution.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Skill gaps" subtitle="Cohort mastery vs. role requirement.">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={skillGap} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="skill" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="have" name="Current" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="need" name="Target" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Average readiness" subtitle="Where your batch stands.">
          <div className="text-5xl font-semibold tracking-tight">{avg}<span className="text-base text-muted-foreground">/100</span></div>
          <p className="text-sm text-muted-foreground mt-2">Median has climbed 12 points over the last quarter. Focus on system-design content to unlock the next tier.</p>
          <div className="mt-4 space-y-2">
            {[["Top decile", 92], ["Median", avg], ["Bottom decile", 48]].map(([k, v]) => (
              <div key={k as string} className="flex items-center gap-3 text-xs">
                <div className="w-24 text-muted-foreground">{k}</div>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${v}%` }} />
                </div>
                <div className="w-8 text-right font-medium">{v}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Placement trend" subtitle="Offers extended per month.">
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={placementTrend} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", fontSize: 12 }} />
                <Line type="monotone" dataKey="offers" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="card-surface p-6">
      <div className="mb-4">
        <div className="text-sm font-semibold">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}
