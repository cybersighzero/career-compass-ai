import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/layout/AdminShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { getStudents } from "@/lib/api";

export const Route = createFileRoute("/admin/students/")({
  head: () => ({
    meta: [
      { title: "Students · PlacePrep Admin" },
      {
        name: "description",
        content: "Manage every student profile — readiness, roles, filters and detailed insights.",
      },
    ],
  }),
  component: StudentsPage,
});

const PAGE_SIZE = 10;

function StudentsPage() {
  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const roles = Array.from(
    new Set(students.map((s) => s.role_preference).filter((r): r is string => !!r)),
  );

  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          (role === "all" || s.role_preference === role) &&
          (status === "all" || (s.readiness_status ?? "Not evaluated") === status) &&
          (s.name.toLowerCase().includes(q.toLowerCase()) ||
            s.roll_number.toLowerCase().includes(q.toLowerCase())),
      ),
    [students, q, role, status],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const view = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportCsv = () => {
    const header = ["Name", "Roll Number", "CGPA", "Role", "Quiz Score", "Readiness"];
    const rows = filtered.map((s) => [
      s.name,
      s.roll_number,
      s.cgpa,
      s.role_preference ?? "",
      s.quiz_score ?? "",
      s.readiness_status ?? "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminShell title="Students" subtitle={`${filtered.length} students match your filters.`}>
      <div className="card-surface">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative flex-1 min-w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or roll number"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={role}
            onValueChange={(v) => {
              setRole(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {roles.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Ready">Ready</SelectItem>
              <SelectItem value="Not Ready">Not Ready</SelectItem>
              <SelectItem value="Not evaluated">Not evaluated</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
            <Download className="size-4" /> Export
          </Button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Roll number</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Target role</TableHead>
                <TableHead>Quiz score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {view.map((s) => (
                <TableRow key={s.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      to="/admin/students/$id"
                      params={{ id: String(s.id) }}
                      className="flex items-center gap-3"
                    >
                      <div className="grid size-8 place-items-center rounded-full bg-accent text-accent-foreground text-[11px] font-semibold">
                        {s.name
                          .split(" ")
                          .map((x) => x[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <span className="font-medium hover:text-primary">{s.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {s.roll_number}
                  </TableCell>
                  <TableCell className="tabular-nums">{s.cgpa}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.role_preference || "—"}
                  </TableCell>
                  <TableCell className="tabular-nums">{s.quiz_score ?? "—"}</TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="flex items-center justify-between border-t border-border p-4 text-sm">
          <span className="text-muted-foreground">
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="size-4" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
            >
              Next <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
