import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/layout/AdminShell";
import { API_BASE_URL } from "@/lib/api";
import { Info } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Admin settings · PlacePrep Admin" },
      { name: "description", content: "Console configuration." },
    ],
  }),
  component: AdminSettings,
});

function AdminSettings() {
  return (
    <AdminShell title="Settings" subtitle="Console configuration.">
      <div className="card-surface p-6 max-w-xl">
        <div className="flex items-start gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary shrink-0">
            <Info className="size-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">Connected backend</div>
            <p className="mt-1 text-sm text-muted-foreground">{API_BASE_URL}</p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Organization-level settings (institute name, digest schedules, automation rules)
              aren't stored by the backend yet, so there's nothing configurable here at the moment.
              Once the backend exposes a settings endpoint, this page can read and write it
              directly.
            </p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
