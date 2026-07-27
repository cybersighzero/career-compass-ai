import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/layout/AdminShell";
import { preferredRoles } from "@/lib/mock-data";
import { BookOpen, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/roles")({
  head: () => ({
    meta: [
      { title: "Role templates · PlacePrep Admin" },
      { name: "description", content: "Configure assessment templates per placement role." },
    ],
  }),
  component: RolesPage,
});

const templates = preferredRoles.map((r, i) => ({
  role: r,
  questions: 20 + (i % 3) * 4,
  interviewMin: 30 + (i % 4) * 5,
  applicants: 40 - (i * 3),
  skills: ["Communication", "Problem solving", "Domain knowledge"],
}));

function RolesPage() {
  return (
    <AdminShell title="Role templates" subtitle="Assessment and interview blueprints per target role.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <div key={t.role} className="card-surface card-hover p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary"><BookOpen className="size-4" /></div>
              <div className="text-sm font-semibold">{t.role}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-border p-3">
                <div className="text-lg font-semibold">{t.questions}</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Questions</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-lg font-semibold">{t.interviewMin}m</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Interview</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5"><Users className="size-3.5" /> {t.applicants} applicants</div>
            <div className="mt-3 flex flex-wrap gap-1">
              {t.skills.map((s) => <Badge key={s} variant="secondary" className="font-normal">{s}</Badge>)}
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
