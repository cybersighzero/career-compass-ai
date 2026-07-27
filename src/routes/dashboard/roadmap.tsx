import { createFileRoute } from "@tanstack/react-router";
import { StudentShell } from "@/components/layout/StudentShell";
import { roadmap } from "@/lib/mock-data";
import {
  Award, BookOpen, CalendarDays, Code2, FileText, GraduationCap, Rocket, Sparkles, Target,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/roadmap")({
  head: () => ({
    meta: [
      { title: "Your roadmap · PlacePrep AI" },
      { name: "description", content: "A personalized 8-week roadmap to become placement ready." },
    ],
  }),
  component: RoadmapPage,
});

const sections = [
  { key: "resume", title: "Resume", icon: FileText, items: roadmap.resume },
  { key: "technical", title: "Technical Skills", icon: Code2, items: roadmap.technical },
  { key: "soft", title: "Soft Skills", icon: Sparkles, items: roadmap.soft },
  { key: "projects", title: "Projects", icon: Rocket, items: roadmap.projects },
  { key: "certifications", title: "Certifications", icon: Award, items: roadmap.certifications },
  { key: "practice", title: "Practice Plan", icon: Target, items: roadmap.practice },
  { key: "interviewPrep", title: "Interview Preparation", icon: GraduationCap, items: roadmap.interviewPrep },
  { key: "courses", title: "Courses", icon: BookOpen, items: roadmap.courses },
];

function RoadmapPage() {
  return (
    <StudentShell title="Your personalized roadmap" subtitle="An 8-week plan tuned to your target role and current readiness.">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {sections.map(({ key, title, icon: Icon, items }) => (
            <div key={key} className="card-surface p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary"><Icon className="size-4" /></div>
                <div className="text-sm font-semibold">{title}</div>
              </div>
              <ul className="space-y-2 text-sm text-foreground/85">
                {items.map((t) => (
                  <li key={t} className="flex gap-2.5"><span className="mt-2 size-1.5 rounded-full bg-primary shrink-0" /> {t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <aside className="space-y-4">
          <div className="card-surface p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><CalendarDays className="size-4" /></div>
              <div className="text-sm font-semibold">Timeline</div>
            </div>
            <ol className="relative border-l border-border pl-4 space-y-4">
              {roadmap.timeline.map((t, i) => (
                <li key={t.when} className="relative">
                  <span className="absolute -left-[19px] top-1 grid size-3 place-items-center rounded-full border-2 border-background bg-primary" />
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.when}</div>
                  <div className="text-sm">{t.focus}</div>
                </li>
              ))}
            </ol>
          </div>
          <div className="card-surface p-6">
            <div className="text-sm font-semibold">Estimated impact</div>
            <div className="mt-3 flex items-end gap-2">
              <div className="text-3xl font-semibold">+12</div>
              <div className="pb-1 text-xs text-muted-foreground">readiness in 8 weeks</div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-chart-2 w-4/5" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Based on completion of ≥80% of the plan and two mocks per week.</p>
          </div>
        </aside>
      </div>
    </StudentShell>
  );
}
