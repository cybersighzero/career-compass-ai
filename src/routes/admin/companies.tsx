import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/layout/AdminShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockCompanies } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/companies")({
  head: () => ({
    meta: [
      { title: "Companies · PlacePrep Admin" },
      { name: "description", content: "Manage hiring partners, requirements and role openings." },
    ],
  }),
  component: CompaniesPage,
});

function CompaniesPage() {
  return (
    <AdminShell title="Hiring companies" subtitle="Manage partners, role requirements and hiring status." actions={
      <Button size="sm" onClick={() => toast.success("New company draft created")}><Plus className="size-4" /> Add company</Button>
    }>
      <div className="card-surface overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-border">
          <div className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary"><Building2 className="size-4" /></div>
          <div>
            <div className="text-sm font-semibold">Directory</div>
            <div className="text-xs text-muted-foreground">{mockCompanies.length} partner companies</div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Min. CGPA</TableHead>
              <TableHead>Required skills</TableHead>
              <TableHead>Openings</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCompanies.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground text-xs font-semibold">{c.logo}</div>
                    <span className="font-medium">{c.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{c.industry}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {c.roles.map((r) => <Badge key={r} variant="secondary" className="font-normal">{r}</Badge>)}
                  </div>
                </TableCell>
                <TableCell className="tabular-nums">{c.cgpa}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {c.skills.map((s) => <span key={s} className="text-[11px] rounded-md bg-muted px-1.5 py-0.5">{s}</span>)}
                  </div>
                </TableCell>
                <TableCell className="tabular-nums">{c.openings}</TableCell>
                <TableCell>
                  <Badge className={
                    c.status === "Hiring" ? "bg-success/15 text-success border border-success/20"
                    : c.status === "Upcoming" ? "bg-primary-soft text-primary border border-primary/20"
                    : "bg-muted text-muted-foreground border border-border"
                  }>{c.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" aria-label="Edit"><Pencil className="size-4" /></Button>
                  <Button variant="ghost" size="icon" aria-label="Delete"><Trash2 className="size-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminShell>
  );
}
