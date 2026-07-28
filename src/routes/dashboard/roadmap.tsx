import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { StudentShell } from "@/components/layout/StudentShell";
import { getGapAnalysis } from "@/lib/api";
import { getStoredStudent } from "@/lib/session";
import { Bot, Target } from "lucide-react";

export const Route = createFileRoute("/dashboard/roadmap")({
  head: () => ({
    meta: [
      { title: "Your roadmap · PlacePrep AI" },
      { name: "description", content: "AI-generated guidance based on your current skill gap." },
    ],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  const nav = useNavigate();
  const student = getStoredStudent();

  useEffect(() => {
    if (!student) nav({ to: "/" });
  }, [student, nav]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["gap-analysis", student?.id],
    queryFn: () => getGapAnalysis(student!.id),
    enabled: !!student?.company_preference,
    retry: false,
  });

  if (!student) return null;

  return (
    <StudentShell
      title="Your roadmap"
      subtitle="AI guidance based on your CGPA, skills, quiz score and interview status against your preferred company."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 card-surface p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary">
              <Bot className="size-4" />
            </div>
            <div className="text-sm font-semibold">AI gap analysis</div>
          </div>
          {!student.company_preference ? (
            <p className="text-sm text-muted-foreground">
              Set a preferred company in Settings first — the roadmap compares your profile against
              that company's requirements.
            </p>
          ) : isLoading ? (
            <p className="text-sm text-muted-foreground">Analyzing your profile…</p>
          ) : isError ? (
            <p className="text-sm text-muted-foreground">
              Couldn't generate a roadmap right now. Try again shortly.
            </p>
          ) : (
            <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">
              {data?.advice}
            </p>
          )}
        </div>

        <aside className="space-y-4">
          <div className="card-surface p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Target className="size-4" />
              </div>
              <div className="text-sm font-semibold">Missing skills</div>
            </div>
            {student.missing_skills ? (
              <ul className="space-y-2 text-sm text-foreground/85">
                {student.missing_skills
                  .split(";")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((s) => (
                    <li key={s} className="flex gap-2.5">
                      <span className="mt-2 size-1.5 rounded-full bg-primary shrink-0" /> {s}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Run a readiness check from your profile to see specific gaps.
              </p>
            )}
          </div>
        </aside>
      </div>
    </StudentShell>
  );
}
