import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StudentShell } from "@/components/layout/StudentShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getStoredStudent, setStoredStudent } from "@/lib/session";
import { updateStudentProfile, confirmPreference, ApiError } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "Settings · PlacePrep AI" },
      { name: "description", content: "Manage your profile and preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const nav = useNavigate();
  const student = getStoredStudent();
  const [cgpa, setCgpa] = useState(student ? String(student.cgpa) : "");
  const [skills, setSkills] = useState(student?.skills ?? "");
  const [projects, setProjects] = useState(student?.projects ?? "");
  const [certifications, setCertifications] = useState(student?.certifications ?? "");
  const [role, setRole] = useState(student?.role_preference ?? "");
  const [company, setCompany] = useState(student?.company_preference ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!student) nav({ to: "/" });
  }, [student, nav]);

  if (!student) return null;

  const saveProfile = async () => {
    setSaving(true);
    try {
      let updated = await updateStudentProfile(student.id, {
        cgpa: Number(cgpa),
        skills,
        projects,
        certifications: certifications || undefined,
      });
      if (role !== student.role_preference || company !== student.company_preference) {
        updated = await confirmPreference(student.id, company, role);
      }
      setStoredStudent(updated);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <StudentShell title="Settings" subtitle="Manage your profile and placement preferences.">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-surface p-6 lg:col-span-2">
          <div className="text-sm font-semibold">Profile</div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <Input value={student.name} disabled />
            </Field>
            <Field label="Roll number">
              <Input value={student.roll_number} disabled />
            </Field>
            <Field label="CGPA">
              <Input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
              />
            </Field>
            <Field label="Certifications">
              <Input
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                placeholder="Optional"
              />
            </Field>
            <Field label="Preferred role">
              <Input value={role} onChange={(e) => setRole(e.target.value)} />
            </Field>
            <Field label="Preferred company">
              <Input value={company} onChange={(e) => setCompany(e.target.value)} />
            </Field>
          </div>
          <div className="mt-4 space-y-1.5">
            <Label>Skills</Label>
            <Textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Comma-separated skills"
              className="min-h-20"
            />
          </div>
          <div className="mt-4 space-y-1.5">
            <Label>Projects</Label>
            <Textarea
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
              className="min-h-24"
            />
          </div>
          <Button className="mt-6" onClick={saveProfile} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </StudentShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
