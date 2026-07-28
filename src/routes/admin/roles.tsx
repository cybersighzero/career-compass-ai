import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/layout/AdminShell";
import { BookOpen, Plus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getCompanies, getStudents, getQuizQuestions, addQuizQuestion, ApiError } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/roles")({
  head: () => ({
    meta: [
      { title: "Role templates · PlacePrep Admin" },
      { name: "description", content: "Quiz question banks per placement role." },
    ],
  }),
  component: RolesPage,
});

function RolesPage() {
  const qc = useQueryClient();
  const { data: companies = [] } = useQuery({ queryKey: ["companies"], queryFn: getCompanies });
  const { data: students = [] } = useQuery({ queryKey: ["students"], queryFn: getStudents });
  const roles = Array.from(new Set(companies.map((c) => c.role))).filter(Boolean);

  const questionQueries = useQueries({
    queries: roles.map((role) => ({
      queryKey: ["quiz-questions", role],
      queryFn: () => getQuizQuestions(role),
    })),
  });

  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");
  const [questionText, setQuestionText] = useState("");

  const addMutation = useMutation({
    mutationFn: () => addQuizQuestion(role, questionText),
    onSuccess: () => {
      toast.success("Question added");
      qc.invalidateQueries({ queryKey: ["quiz-questions", role] });
      setOpen(false);
      setRole("");
      setQuestionText("");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't add question."),
  });

  return (
    <AdminShell
      title="Role templates"
      subtitle="Quiz question banks, per hiring role."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="size-4" /> Add question
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a quiz question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder={roles[0] ?? "Software Engineer"}
                  list="role-list"
                />
                <datalist id="role-list">
                  {roles.map((r) => (
                    <option key={r} value={r} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-1.5">
                <Label>Question text</Label>
                <Input value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => addMutation.mutate()}
                disabled={!role || !questionText || addMutation.isPending}
              >
                {addMutation.isPending ? "Adding…" : "Add question"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {roles.length === 0 ? (
        <div className="card-surface p-8 text-center text-sm text-muted-foreground">
          Add a hiring company first — role templates are derived from companies' listed roles.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((r, i) => {
            const questionCount = questionQueries[i]?.data?.length ?? 0;
            const applicants = students.filter((s) => s.role_preference === r).length;
            return (
              <div key={r} className="card-surface card-hover p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary">
                    <BookOpen className="size-4" />
                  </div>
                  <div className="text-sm font-semibold">{r}</div>
                </div>
                <div className="rounded-lg border border-border p-3 text-center">
                  <div className="text-lg font-semibold">
                    {questionQueries[i]?.isLoading ? "…" : questionCount}
                  </div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    Quiz questions
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5">
                  <Users className="size-3.5" /> {applicants} students targeting this role
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
