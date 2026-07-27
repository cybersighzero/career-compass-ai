import { createFileRoute } from "@tanstack/react-router";
import { StudentShell } from "@/components/layout/StudentShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/dashboard/quiz-history")({
  head: () => ({
    meta: [
      { title: "Quiz history · PlacePrep AI" },
      { name: "description", content: "Every assessment attempt with score, topic breakdown, and review." },
    ],
  }),
  component: QuizHistory,
});

const rows = [
  { d: "Jul 24, 2026", topic: "Full Stack — Comprehensive", score: 82, time: "48m 12s", status: "Reviewed" },
  { d: "Jul 10, 2026", topic: "System Design Fundamentals", score: 68, time: "50m 00s", status: "Reviewed" },
  { d: "Jun 27, 2026", topic: "DSA — Intermediate", score: 79, time: "45m 34s", status: "Reviewed" },
  { d: "Jun 14, 2026", topic: "Databases & SQL", score: 74, time: "42m 20s", status: "Reviewed" },
  { d: "May 30, 2026", topic: "OS & Networking", score: 66, time: "49m 08s", status: "Reviewed" },
];

function QuizHistory() {
  return (
    <StudentShell title="Quiz history" subtitle="Every assessment attempt, scored and reviewed.">
      <div className="card-surface">
        <div className="flex items-center gap-2 p-5 border-b border-border">
          <div className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary"><ClipboardList className="size-4" /></div>
          <div>
            <div className="text-sm font-semibold">All attempts</div>
            <div className="text-xs text-muted-foreground">{rows.length} sessions</div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Assessment</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.d}>
                <TableCell className="text-muted-foreground">{r.d}</TableCell>
                <TableCell className="font-medium">{r.topic}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${r.score}%` }} />
                    </div>
                    <span className="text-sm font-medium tabular-nums">{r.score}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">{r.time}</TableCell>
                <TableCell><Badge variant="secondary">{r.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm"><Eye className="size-4" /> Review</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </StudentShell>
  );
}
