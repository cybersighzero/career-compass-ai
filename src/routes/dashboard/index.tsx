import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { StudentShell } from "@/components/layout/StudentShell";
import { StatCard } from "@/components/StatCard";
import { Award, Play, Target, Trophy, Video, Map as MapIcon, Sparkles } from "lucide-react";
import { getStoredStudent } from "@/lib/session";
import { getQuizHistory, getInterviewHistory } from "@/lib/history";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Overview · PlacePrep AI" },
      {
        name: "description",
        content: "Your placement readiness overview — scores, activity and next actions.",
      },
    ],
  }),
  component: DashboardHome,
});

function DashboardHome() {
  const nav = useNavigate();
  const student = getStoredStudent();

  useEffect(() => {
    if (!student) nav({ to: "/" });
  }, [student, nav]);

  if (!student) return null;

  const quizHistory = getQuizHistory(student.id);
  const interviewHistory = getInterviewHistory(student.id);
  const activity = [
    ...quizHistory.map((q) => ({
      when: q.date,
      text: `Submitted assessment for ${q.role} · ${q.answered}/${q.total} answered`,
    })),
    ...interviewHistory.map((i) => ({
      when: i.date,
      text: `Completed AI interview · status: ${i.status}`,
    })),
  ]
    .sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime())
    .slice(0, 6);

  return (
    <StudentShell
      title={`Welcome, ${student.name.split(" ")[0]}`}
      subtitle="Here's a snapshot of your placement readiness."
    >
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Readiness status"
            value={student.readiness_status ?? "Not evaluated"}
            icon={<Trophy className="size-4" />}
          />
          <StatCard
            label="Quiz score"
            value={student.quiz_score != null ? `${student.quiz_score}/10 avg` : "—"}
            icon={<Award className="size-4" />}
          />
          <StatCard
            label="Interview status"
            value={student.interview_status ?? "Not started"}
            icon={<Video className="size-4" />}
          />
          <StatCard label="CGPA" value={student.cgpa} icon={<Sparkles className="size-4" />} />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="card-surface p-6 lg:col-span-2">
            <div className="text-sm font-semibold">Profile</div>
            <div className="text-xs text-muted-foreground">
              What the placement engine currently knows about you.
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
              <Row k="Preferred role" v={student.role_preference || "Not set"} />
              <Row k="Preferred company" v={student.company_preference || "Not set"} />
              <Row k="Skills" v={student.skills || "—"} />
              <Row k="Certifications" v={student.certifications || "—"} />
            </div>
            {(!student.role_preference || !student.company_preference) && (
              <p className="mt-4 text-xs text-warning-foreground">
                Set a preferred role and company in Settings to unlock the assessment and gap
                analysis.
              </p>
            )}
          </div>

          <div className="card-surface p-6">
            <div className="text-sm font-semibold">Quick actions</div>
            <div className="mt-4 grid gap-2">
              <Button asChild variant="outline" className="justify-start">
                <Link to="/quiz">
                  <Play className="size-4" /> Start assessment
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/interview">
                  <Video className="size-4" /> Practice AI interview
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/dashboard/roadmap">
                  <MapIcon className="size-4" /> Open my roadmap
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/results">
                  <Trophy className="size-4" /> Review last results
                </Link>
              </Button>
            </div>
            <div className="mt-6 rounded-xl border border-border bg-primary-soft p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-accent-foreground">
                <Target className="size-4" /> Missing skills
              </div>
              <p className="mt-1 text-xs text-accent-foreground/80">
                {student.missing_skills
                  ? student.missing_skills
                  : "None recorded yet — complete a readiness check to find out."}
              </p>
            </div>
          </div>
        </section>

        <section className="card-surface p-6">
          <div className="text-sm font-semibold">Recent activity</div>
          <div className="text-xs text-muted-foreground">
            Assessments and interviews completed in this browser.
          </div>
          {activity.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No activity yet — start an assessment to see it here.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {activity.map((a, i) => (
                <li key={i} className="flex items-center gap-3 py-3">
                  <div className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm">{a.text}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(a.when).toLocaleString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </StudentShell>
  );
}

function Row({ k, v }: { k: string; v: string | number }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="mt-0.5 truncate">{v}</div>
    </div>
  );
}
