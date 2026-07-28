import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Award, ArrowRight, Bot, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getGapAnalysis, getStudents, type InterviewFinishResult } from "@/lib/api";
import { getStoredStudent, setStoredStudent } from "@/lib/session";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your results · PlacePrep AI" },
      {
        name: "description",
        content:
          "Placement readiness score, AI interview feedback and personalized recommendations.",
      },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const nav = useNavigate();
  const stored = getStoredStudent();
  const [lastInterview, setLastInterview] = useState<InterviewFinishResult | null>(null);

  useEffect(() => {
    if (!stored) {
      nav({ to: "/" });
      return;
    }
    const raw = sessionStorage.getItem("placeprep.lastInterview");
    if (raw) {
      try {
        setLastInterview(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    }
  }, [stored, nav]);

  // Refresh the student record — quiz_score / readiness_status are computed server-side
  // after the interview finishes, so the value we had at login is stale.
  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
    enabled: !!stored,
  });
  const student = students?.find((s) => s.id === stored?.id) ?? stored;

  useEffect(() => {
    if (student && students) setStoredStudent(student);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students]);

  const {
    data: gapAnalysis,
    isLoading: gapLoading,
    isError: gapError,
  } = useQuery({
    queryKey: ["gap-analysis", student?.id],
    queryFn: () => getGapAnalysis(student!.id),
    enabled: !!student?.company_preference,
    retry: false,
  });

  if (!stored || !student) return null;

  const readyBadge = student.readiness_status === "Ready";
  const missingSkills = (student.missing_skills ?? "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background page-fade-in">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4">
          <div className="grid size-9 place-items-center rounded-xl bg-success text-success-foreground">
            <Award className="size-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold tracking-tight">Assessment complete</div>
            <div className="text-xs text-muted-foreground">
              Reviewed by PlacePrep AI · session finalized just now
            </div>
          </div>
          <Button asChild>
            <Link to="/dashboard">
              Go to dashboard <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="card-surface p-6 md:col-span-1">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Readiness status
            </div>
            <div className="mt-3 flex items-end gap-2">
              <div className="text-3xl font-semibold tracking-tight">
                {student.readiness_status ?? "Not evaluated"}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              {student.readiness_status && (
                <Badge
                  className={
                    readyBadge
                      ? "bg-success/15 text-success border border-success/20"
                      : "bg-warning/15 text-warning-foreground border border-warning/30"
                  }
                >
                  {readyBadge ? "Placement Ready" : "Not Ready Yet"}
                </Badge>
              )}
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Computed from your CGPA, quiz score, interview completion and skill match against{" "}
              {student.company_preference || "your preferred company"}.
            </p>
          </div>
          <div className="card-surface p-6">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Quiz score
            </div>
            <div className="mt-3 text-4xl font-semibold tracking-tight">
              {student.quiz_score ?? "—"}
              <span className="text-base text-muted-foreground">/10 avg</span>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Average AI grade across your submitted answers.
            </p>
          </div>
          <div className="card-surface p-6">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Interview status
            </div>
            <div className="mt-3 text-4xl font-semibold tracking-tight capitalize">
              {lastInterview?.status ?? student.interview_status ?? "—"}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {lastInterview
                ? "From the interview you just completed."
                : "No completed interview on record yet."}
            </p>
          </div>
        </section>

        {missingSkills.length > 0 && (
          <section className="card-surface p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="grid size-8 place-items-center rounded-lg bg-warning/15 text-warning-foreground">
                <XCircle className="size-4" />
              </div>
              <div className="text-sm font-semibold">Gaps holding back your readiness</div>
            </div>
            <ul className="space-y-2 text-sm text-foreground/80">
              {missingSkills.map((s) => (
                <li key={s} className="flex gap-2">
                  <span className="mt-2 size-1.5 rounded-full bg-warning shrink-0" /> {s}
                </li>
              ))}
            </ul>
          </section>
        )}

        {student.readiness_status === "Ready" && (
          <section className="card-surface p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="grid size-8 place-items-center rounded-lg bg-success/15 text-success">
                <CheckCircle2 className="size-4" />
              </div>
              <div className="text-sm font-semibold">You're placement ready</div>
            </div>
            <p className="text-sm text-foreground/80">
              Your CGPA, quiz score, interview completion and skills all meet{" "}
              {student.company_preference}'s requirements.
            </p>
          </section>
        )}

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="card-surface p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary">
                <Bot className="size-4" />
              </div>
              <div className="text-sm font-semibold">AI gap analysis</div>
            </div>
            {!student.company_preference ? (
              <p className="text-sm text-muted-foreground">
                Set a preferred company in your profile to get a personalized gap analysis.
              </p>
            ) : gapLoading ? (
              <p className="text-sm text-muted-foreground">Analyzing…</p>
            ) : gapError ? (
              <p className="text-sm text-muted-foreground">
                Couldn't generate gap analysis right now.
              </p>
            ) : (
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                {gapAnalysis?.advice}
              </p>
            )}
          </div>

          <div className="card-surface p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary">
                <Bot className="size-4" />
              </div>
              <div className="text-sm font-semibold">AI interviewer feedback</div>
            </div>
            {lastInterview?.ai_feedback ? (
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                {lastInterview.ai_feedback}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Complete an AI interview to see feedback here.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
