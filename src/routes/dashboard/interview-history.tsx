import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { StudentShell } from "@/components/layout/StudentShell";
import { Badge } from "@/components/ui/badge";
import { Video } from "lucide-react";
import { getStoredStudent } from "@/lib/session";
import { getInterviewHistory } from "@/lib/history";

export const Route = createFileRoute("/dashboard/interview-history")({
  head: () => ({
    meta: [
      { title: "Interview history · PlacePrep AI" },
      { name: "description", content: "AI interview sessions recorded in this browser." },
    ],
  }),
  component: InterviewHistory,
});

function InterviewHistory() {
  const nav = useNavigate();
  const student = getStoredStudent();

  useEffect(() => {
    if (!student) nav({ to: "/" });
  }, [student, nav]);

  if (!student) return null;
  const items = getInterviewHistory(student.id);

  return (
    <StudentShell
      title="Interview history"
      subtitle="AI mock interviews completed in this browser, with feedback."
    >
      {items.length === 0 ? (
        <div className="card-surface p-8 text-center text-sm text-muted-foreground">
          No interviews yet. Start one from your dashboard.
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((s, i) => (
            <div key={i} className="card-surface card-hover p-5 flex flex-wrap items-center gap-4">
              <div className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary shrink-0">
                <Video className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">Interview #{s.interviewId}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(s.date).toLocaleString()} · {s.questionCount} questions
                </div>
                {s.aiFeedback && (
                  <p className="mt-2 text-xs text-foreground/70 line-clamp-2">{s.aiFeedback}</p>
                )}
              </div>
              <Badge
                className={
                  s.status === "completed"
                    ? "bg-success/15 text-success border border-success/20"
                    : "bg-warning/15 text-warning-foreground border border-warning/30"
                }
              >
                {s.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </StudentShell>
  );
}
