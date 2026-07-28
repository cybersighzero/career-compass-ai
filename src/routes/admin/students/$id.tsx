import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/layout/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStudents, getGapAnalysis } from "@/lib/api";
import { ArrowLeft, Bot, Target } from "lucide-react";

export const Route = createFileRoute("/admin/students/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Student ${params.id} · PlacePrep Admin` },
      {
        name: "description",
        content: "Detailed student profile — academic record, assessment results and roadmap.",
      },
    ],
  }),
  component: StudentProfile,
});

function StudentProfile() {
  const { id } = Route.useParams();
  const studentId = Number(id);
  const { data: students, isLoading } = useQuery({ queryKey: ["students"], queryFn: getStudents });
  const student = students?.find((s) => s.id === studentId);

  const { data: gapAnalysis, isLoading: gapLoading } = useQuery({
    queryKey: ["gap-analysis", studentId],
    queryFn: () => getGapAnalysis(studentId),
    enabled: !!student?.company_preference,
    retry: false,
  });

  if (isLoading) {
    return (
      <AdminShell title="Loading…" subtitle="">
        <div />
      </AdminShell>
    );
  }

  if (!student) {
    return (
      <AdminShell title="Student not found" subtitle="This profile may have been removed.">
        <Button asChild variant="outline">
          <Link to="/admin/students">
            <ArrowLeft className="size-4" /> Back to students
          </Link>
        </Button>
      </AdminShell>
    );
  }

  const missingSkills = (student.missing_skills ?? "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <AdminShell
      title={student.name}
      subtitle={`${student.roll_number} · Target: ${student.role_preference || "—"}`}
      actions={
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/students">
            <ArrowLeft className="size-4" /> Back
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-surface p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground text-lg font-semibold">
              {student.name
                .split(" ")
                .map((x) => x[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <div className="text-lg font-semibold">{student.name}</div>
              <div className="text-xs text-muted-foreground">{student.roll_number}</div>
            </div>
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            <Row k="CGPA" v={student.cgpa} />
            <Row k="Target role" v={student.role_preference || "—"} />
            <Row k="Preferred company" v={student.company_preference || "—"} />
            <Row k="Quiz score" v={student.quiz_score != null ? `${student.quiz_score}/10` : "—"} />
            <Row k="Interview status" v={student.interview_status || "Not started"} />
            <Row
              k="Status"
              v={
                <Badge
                  className={
                    student.readiness_status === "Ready"
                      ? "bg-success/15 text-success border border-success/20"
                      : student.readiness_status === "Not Ready"
                        ? "bg-warning/15 text-warning-foreground border border-warning/30"
                        : "bg-muted text-muted-foreground border border-border"
                  }
                >
                  {student.readiness_status ?? "Not evaluated"}
                </Badge>
              }
            />
          </dl>
        </div>

        <div className="card-surface p-6 lg:col-span-2">
          <div className="text-sm font-semibold">Skills & projects</div>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Skills
              </div>
              <div className="flex flex-wrap gap-1.5">
                {student.skills
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((s) => (
                    <Badge key={s} variant="secondary" className="font-normal">
                      {s}
                    </Badge>
                  ))}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Projects
              </div>
              <p className="text-foreground/85 leading-relaxed">{student.projects}</p>
            </div>
            {student.certifications && (
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Certifications
                </div>
                <p className="text-foreground/85">{student.certifications}</p>
              </div>
            )}
          </div>
        </div>

        {missingSkills.length > 0 && (
          <div className="card-surface p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="grid size-8 place-items-center rounded-lg bg-warning/15 text-warning-foreground">
                <Target className="size-4" />
              </div>
              <div className="text-sm font-semibold">Missing skills</div>
            </div>
            <ul className="space-y-2 text-sm text-foreground/85">
              {missingSkills.map((s) => (
                <li key={s} className="flex gap-2">
                  <span className="mt-2 size-1.5 rounded-full bg-warning shrink-0" /> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          className={`card-surface p-6 ${missingSkills.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary">
              <Bot className="size-4" />
            </div>
            <div className="text-sm font-semibold">AI gap analysis</div>
          </div>
          {!student.company_preference ? (
            <p className="text-sm text-muted-foreground">
              No preferred company set for this student yet.
            </p>
          ) : gapLoading ? (
            <p className="text-sm text-muted-foreground">Analyzing…</p>
          ) : (
            <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">
              {gapAnalysis?.advice}
            </p>
          )}
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
