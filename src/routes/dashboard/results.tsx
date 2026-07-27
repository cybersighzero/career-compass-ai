import { createFileRoute, Link } from "@tanstack/react-router";
import { StudentShell } from "@/components/layout/StudentShell";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy } from "lucide-react";

export const Route = createFileRoute("/dashboard/results")({
  head: () => ({
    meta: [
      { title: "Results · PlacePrep AI" },
      { name: "description", content: "View your latest assessment results and AI interview feedback." },
    ],
  }),
  component: ResultsShortcut,
});

function ResultsShortcut() {
  return (
    <StudentShell title="Results" subtitle="Your latest assessment outcome.">
      <div className="card-surface p-8 text-center max-w-xl mx-auto">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-success/15 text-success"><Trophy className="size-7" /></div>
        <div className="mt-4 text-2xl font-semibold">Readiness score · 78/100</div>
        <p className="mt-2 text-sm text-muted-foreground">Open the full report for detailed breakdown, AI interview feedback and recommendations.</p>
        <Button asChild className="mt-6"><Link to="/results">Open full results <ArrowRight className="size-4" /></Link></Button>
      </div>
    </StudentShell>
  );
}
