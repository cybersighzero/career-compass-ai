import { createFileRoute } from "@tanstack/react-router";
import { StudentShell } from "@/components/layout/StudentShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { mockStudent } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "Settings · PlacePrep AI" },
      { name: "description", content: "Manage your profile, notifications and account preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <StudentShell title="Settings" subtitle="Manage your profile and preferences.">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-surface p-6 lg:col-span-2">
          <div className="text-sm font-semibold">Profile</div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value={mockStudent.name} />
            <Field label="Email" value={mockStudent.email} />
            <Field label="Phone" value={mockStudent.phone} />
            <Field label="Department" value={mockStudent.department} />
          </div>
          <Button className="mt-6" onClick={() => toast.success("Profile updated")}>Save changes</Button>
        </div>
        <div className="card-surface p-6 space-y-5">
          <div className="text-sm font-semibold">Notifications</div>
          {[
            { l: "Weekly readiness digest", d: "Sent every Sunday", on: true },
            { l: "Quiz reminders", d: "Nudges to keep your streak", on: true },
            { l: "Mock interview alerts", d: "New slots and feedback", on: false },
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
    </StudentShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <div className="space-y-1.5"><Label>{label}</Label><Input defaultValue={value} /></div>;
}
