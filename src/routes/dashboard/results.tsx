import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { StudentShell } from "@/components/layout/StudentShell";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy } from "lucide-react";
import { getStoredStudent } from "@/lib/session";

export const Route = createFileRoute("/dashboard/results")({
  head: () => ({
    meta: [
      { title: "Results · PlacePrep AI" },
      {
        name: "description",
        content: "View your latest assessment results and AI interview feedback.",
      },
    ],
  }),
  component: ResultsShortcut,
});

function ResultsShortcut() {
  const nav = useNavigate();
  const student = getStoredStudent();

  useEffect(() => {
    if (!student) nav({ to: "/" });
  }, [student, nav]);

  if (!student) return null;

  return (
    <StudentShell title="Results" subtitle="Your latest assessment outcome.">
      <div className="card-surface p-8 text-center max-w-xl mx-auto">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-success/15 text-success">
          <Trophy className="size-7" />
        </div>
        <div className="mt-4 text-2xl font-semibold">
          {student.readiness_status ?? "Not evaluated yet"}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Open the full report for detailed breakdown, AI interview feedback and recommendations.
        </p>
        <Button asChild className="mt-6">
          <Link to="/results">
            Open full results <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </StudentShell>
  );
}
