import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/layout/AdminShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Admin settings · PlacePrep Admin" },
      { name: "description", content: "Placement cell configuration and permissions." },
    ],
  }),
  component: AdminSettings,
});

function AdminSettings() {
  return (
    <AdminShell title="Settings" subtitle="Console preferences and placement cell defaults.">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-surface p-6 lg:col-span-2">
          <div className="text-sm font-semibold">Organization</div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Institute name" value="Vellore Institute of Technology" />
            <Field label="Placement cell email" value="placement@vit.ac.in" />
            <Field label="Academic year" value="2025–2026" />
            <Field label="Default min. CGPA" value="6.5" />
          </div>
          <Button className="mt-6" onClick={() => toast.success("Settings saved")}>Save changes</Button>
        </div>
        <div className="card-surface p-6 space-y-5">
          <div className="text-sm font-semibold">Automation</div>
          {[
            { l: "Weekly digest to students", d: "Every Sunday, 8pm", on: true },
            { l: "Auto-flag low readiness (<50)", d: "Push to placement counselors", on: true },
            { l: "Send offer alerts to companies", d: "As soon as acceptance is recorded", on: false },
          ].map((r) => (
            <div key={r.l} className="flex items-start gap-3">
              <Switch defaultChecked={r.on} />
              <div>
                <div className="text-sm">{r.l}</div>
                <div className="text-xs text-muted-foreground">{r.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
function Field({ label, value }: { label: string; value: string }) {
  return <div className="space-y-1.5"><Label>{label}</Label><Input defaultValue={value} /></div>;
}
