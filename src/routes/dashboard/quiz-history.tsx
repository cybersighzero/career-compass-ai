import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { StudentShell } from "@/components/layout/StudentShell";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStoredStudent } from "@/lib/session";
import { getQuizHistory } from "@/lib/history";

export const Route = createFileRoute("/dashboard/quiz-history")({
  head: () => ({
    meta: [
      { title: "Quiz history · PlacePrep AI" },
      { name: "description", content: "Assessment attempts recorded in this browser." },
    ],
  }),
  component: QuizHistory,
});

function QuizHistory() {
  const nav = useNavigate();
  const student = getStoredStudent();

  useEffect(() => {
    if (!student) nav({ to: "/" });
  }, [student, nav]);

  if (!student) return null;
  const rows = getQuizHistory(student.id);

  return (
    <StudentShell
      title="Quiz history"
      subtitle="Assessment attempts you've submitted, recorded in this browser."
    >
      <div className="card-surface">
        <div className="flex items-center gap-2 p-5 border-b border-border">
          <div className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary">
            <ClipboardList className="size-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">All attempts</div>
            <div className="text-xs text-muted-foreground">{rows.length} sessions</div>
          </div>
        </div>
        {rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No attempts yet. Take an assessment to see it here.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Answered</TableHead>
                <TableHead>Avg AI score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="text-muted-foreground">
                    {new Date(r.date).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{r.role}</TableCell>
                  <TableCell className="tabular-nums">
                    {r.answered}/{r.total}
                  </TableCell>
                  <TableCell>
                    {r.averageScore != null ? (
                      <Badge variant="secondary">{r.averageScore.toFixed(1)}/10</Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </StudentShell>
  );
}
