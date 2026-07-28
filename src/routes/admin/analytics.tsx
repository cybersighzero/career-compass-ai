import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/layout/AdminShell";
import { getStudents, getReadinessSummary } from "@/lib/api";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics · PlacePrep Admin" },
      {
        name: "description",
        content: "Cohort analytics — role distribution and readiness outcomes.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const colors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-primary)",
];

function AnalyticsPage() {
  const { data: students = [] } = useQuery({ queryKey: ["students"], queryFn: getStudents });
  const { data: summary } = useQuery({
    queryKey: ["readiness-summary"],
    queryFn: getReadinessSummary,
  });

  const roleCounts = new Map<string, number>();
  for (const s of students) {
    const role = s.role_preference || "Not set";
    roleCounts.set(role, (roleCounts.get(role) ?? 0) + 1);
  }
  const roleDistribution = Array.from(roleCounts, ([name, value]) => ({ name, value }));

  const readinessDistribution = summary
    ? [
        { name: "Ready", value: summary.ready_count },
        { name: "Not Ready", value: summary.not_ready_count },
        { name: "Not Evaluated", value: summary.not_evaluated_count },
      ]
    : [];

  const gradedCgpas = students.map((s) => s.cgpa).filter((n) => typeof n === "number");
  const avgCgpa = gradedCgpas.length
    ? (gradedCgpas.reduce((a, b) => a + b, 0) / gradedCgpas.length).toFixed(2)
    : "—";

  return (
    <AdminShell title="Analytics" subtitle="How your batch is trending across roles and readiness.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Role distribution"
          subtitle="Preferred target role across registered students."
        >
          {roleDistribution.length === 0 ? (
            <p className="text-sm text-muted-foreground">No students registered yet.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    innerRadius={50}
                    outerRadius={90}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {roleDistribution.map((_, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card title="Readiness outcomes" subtitle="Computed by the backend readiness check.">
          {readinessDistribution.length === 0 ? (
            <p className="text-sm text-muted-foreground">No summary available.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={readinessDistribution}
                    innerRadius={50}
                    outerRadius={90}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {readinessDistribution.map((_, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card title="Average CGPA" subtitle="Across all registered students.">
          <div className="text-5xl font-semibold tracking-tight">{avgCgpa}</div>
        </Card>

        <Card title="Total registered" subtitle="All students who have created a profile.">
          <div className="text-5xl font-semibold tracking-tight">{students.length}</div>
        </Card>
      </div>
    </AdminShell>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
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
