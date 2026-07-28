import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/layout/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getCompanies, createCompany, deleteCompany, ApiError } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/companies")({
  head: () => ({
    meta: [
      { title: "Companies · PlacePrep Admin" },
      { name: "description", content: "Manage hiring partners and role requirements." },
    ],
  }),
  component: CompaniesPage,
});

function CompaniesPage() {
  const qc = useQueryClient();
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [minCgpa, setMinCgpa] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      createCompany({ name, role, required_skills: skills, min_cgpa: Number(minCgpa) }),
    onSuccess: () => {
      toast.success("Company added");
      qc.invalidateQueries({ queryKey: ["companies"] });
      setOpen(false);
      setName("");
      setRole("");
      setSkills("");
      setMinCgpa("");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't add company."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCompany(id),
    onSuccess: () => {
      toast.success("Company removed");
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Couldn't remove company."),
  });

  return (
    <AdminShell
      title="Hiring companies"
      subtitle="Manage partners and role requirements."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="size-4" /> Add company
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a hiring company</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Company name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Required skills (comma-separated)</Label>
                <Input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Python, SQL, AWS"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Minimum CGPA</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => createMutation.mutate()}
                disabled={!name || !role || !skills || !minCgpa || createMutation.isPending}
              >
                {createMutation.isPending ? "Adding…" : "Add company"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="card-surface overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-border">
          <div className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary">
            <Building2 className="size-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">Directory</div>
            <div className="text-xs text-muted-foreground">
              {companies.length} partner companies
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : companies.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No companies added yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Required skills</TableHead>
                <TableHead>Min. CGPA</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground text-xs font-semibold">
                        {c.name
                          .split(" ")
                          .map((x) => x[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.role}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {c.required_skills
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((s) => (
                          <span key={s} className="text-[11px] rounded-md bg-muted px-1.5 py-0.5">
                            {s}
                          </span>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums">{c.min_cgpa}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete"
                      onClick={() => deleteMutation.mutate(c.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </AdminShell>
  );
}
