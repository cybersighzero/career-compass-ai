import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/layout/AdminShell";
import { StatCard } from "@/components/StatCard";
import { Building2, Target, TrendingUp, Users } from "lucide-react";
import { getReadinessSummary, getCompanies } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin dashboard · PlacePrep AI" },
      {
        name: "description",
        content: "Placement cell overview — student readiness and hiring partners.",
      },
    ],
  }),
  component: AdminHome,
});

function AdminHome() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ["readiness-summary"],
    queryFn: getReadinessSummary,
  });
  const { data: companies = [] } = useQuery({ queryKey: ["companies"], queryFn: getCompanies });

  const recent = summary
    ? [
        ...summary.ready_students,
        ...summary.not_ready_students,
        ...summary.not_evaluated_students,
      ].slice(0, 6)
    : [];

  return (
    <AdminShell
      title="Placement dashboard"
      subtitle="Real-time snapshot of the batch's placement readiness."
    >
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Registered students"
            value={isLoading ? "…" : (summary?.total_students ?? 0)}
            icon={<Users className="size-4" />}
          />
          <StatCard
            label="Ready"
            value={isLoading ? "…" : (summary?.ready_count ?? 0)}
            icon={<Target className="size-4" />}
          />
          <StatCard
            label="Not ready"
            value={isLoading ? "…" : (summary?.not_ready_count ?? 0)}
            icon={<TrendingUp className="size-4" />}
          />
          <StatCard
            label="Hiring companies"
            value={companies.length}
            icon={<Building2 className="size-4" />}
          />
        </section>

        <section className="card-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Recent students</div>
              <div className="text-xs text-muted-foreground">
                Latest profiles from the readiness summary.
              </div>
            </div>
            <Link to="/admin/students" className="text-xs text-primary hover:underline">
              View all students →
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No students registered yet.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {recent.map((s) => (
                <Link
                  key={s.id}
                  to="/admin/students/$id"
                  params={{ id: String(s.id) }}
                  className="rounded-xl border border-border p-4 card-hover flex items-center gap-3"
                >
                  <div className="grid size-10 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                    {s.name
                      .split(" ")
                      .map((x) => x[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{s.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {s.role_preference || "No role set"}
                    </div>
                  </div>
                  <Badge
                    className={
                      s.readiness_status === "Ready"
                        ? "bg-success/15 text-success border border-success/20"
                        : s.readiness_status === "Not Ready"
                          ? "bg-warning/15 text-warning-foreground border border-warning/30"
                          : "bg-muted text-muted-foreground border border-border"
                    }
                  >
                    {s.readiness_status ?? "Not evaluated"}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
