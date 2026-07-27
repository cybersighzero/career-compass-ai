import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/layout/AdminShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { students } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/students/")({
  head: () => ({
    meta: [
      { title: "Students · PlacePrep Admin" },
      { name: "description", content: "Manage every student profile — readiness, roles, filters and detailed insights." },
    ],
  }),
  component: StudentsPage,
});

const PAGE_SIZE = 10;

function StudentsPage() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() =>
    students.filter((s) =>
      (dept === "all" || s.dept === dept) &&
      (status === "all" || s.status === status) &&
      (s.name.toLowerCase().includes(q.toLowerCase()) || s.regNo.toLowerCase().includes(q.toLowerCase()))
    ), [q, dept, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const view = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AdminShell title="Students" subtitle={`${filtered.length} students match your filters.`}>
      <div className="card-surface">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative flex-1 min-w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name or registration number" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="pl-9" />
          </div>
          <Select value={dept} onValueChange={(v) => { setDept(v); setPage(1); }}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              {["CSE","IT","ECE","EEE","MECH"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Ready">Ready</SelectItem>
              <SelectItem value="On Track">On Track</SelectItem>
              <SelectItem value="Needs Focus">Needs Focus</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><Download className="size-4" /> Export</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Dept.</TableHead>
              <TableHead>CGPA</TableHead>
              <TableHead>Target role</TableHead>
              <TableHead>Readiness</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {view.map((s) => (
              <TableRow key={s.id} className="cursor-pointer">
                <TableCell>
                  <Link to="/admin/students/$id" params={{ id: s.id }} className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-full bg-accent text-accent-foreground text-[11px] font-semibold">
                      {s.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                    </div>
                    <span className="font-medium hover:text-primary">{s.name}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">{s.regNo}</TableCell>
                <TableCell><Badge variant="secondary">{s.dept}</Badge></TableCell>
                <TableCell className="tabular-nums">{s.cgpa}</TableCell>
                <TableCell className="text-muted-foreground">{s.role}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${s.readiness}%` }} />
                    </div>
                    <span className="text-sm font-medium tabular-nums">{s.readiness}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={
                    s.status === "Ready" ? "bg-success/15 text-success border border-success/20"
                    : s.status === "On Track" ? "bg-primary-soft text-primary border border-primary/20"
                    : "bg-warning/15 text-warning-foreground border border-warning/30"
                  }>{s.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t border-border p-4 text-sm">
          <span className="text-muted-foreground">Page {page} of {pages}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="size-4" /> Prev</Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>Next <ChevronRight className="size-4" /></Button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
