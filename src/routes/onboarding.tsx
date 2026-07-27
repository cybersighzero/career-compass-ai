import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, GraduationCap, Info, Plus, X, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { brand, mockStudent, preferredRoles, skillList, mockCompanies } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get set up · PlacePrep AI" },
      { name: "description", content: "Complete your profile so the AI can personalize your placement readiness plan." },
    ],
  }),
  component: Onboarding,
});

const steps = ["Welcome", "Personal", "Academic", "Links", "Skills", "Preferences", "Review"];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [links, setLinks] = useState([
    { label: "LinkedIn", url: "linkedin.com/in/aarav-sharma" },
    { label: "GitHub", url: "github.com/aarav" },
  ]);
  const [skills, setSkills] = useState<string[]>(["Python", "React", "Node.js", "SQL", "Docker"]);
  const [skillQuery, setSkillQuery] = useState("");
  const [role, setRole] = useState(preferredRoles[3]);
  const [companies, setCompanies] = useState<string[]>(["Nimbus Cloud", "Vector Labs"]);
  const nav = useNavigate();

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const addLink = () => {
    if (links.length >= 5) return toast.warning("You can add up to 5 links.");
    setLinks([...links, { label: "Portfolio", url: "" }]);
  };
  const toggleSkill = (s: string) =>
    setSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  const toggleCompany = (c: string) => {
    if (companies.includes(c)) return setCompanies(companies.filter((x) => x !== c));
    if (companies.length >= 2) return toast.warning("Choose up to 2 preferred companies.");
    setCompanies([...companies, c]);
  };

  const filteredSkills = skillList.filter((s) =>
    s.toLowerCase().includes(skillQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background page-fade-in">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-4">
          <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold tracking-tight">{brand.name}</div>
            <div className="text-[11px] text-muted-foreground">Set up your profile · Step {step + 1} of {steps.length}</div>
          </div>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">Save & exit</Link>
        </div>
        <div className="mx-auto max-w-5xl px-6 pb-4">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-2">
                <div className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold transition-colors ${
                  i < step ? "bg-primary text-primary-foreground" :
                  i === step ? "bg-primary/15 text-primary ring-2 ring-primary/30" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? <Check className="size-3" /> : i + 1}
                </div>
                {i < steps.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
            {steps.map((s) => <span key={s} className="hidden sm:inline">{s}</span>)}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="card-surface p-8 sm:p-10">
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Welcome, {mockStudent.name.split(" ")[0]}.</h2>
              <p className="mt-2 text-muted-foreground">
                PlacePrep AI helps you assess your placement readiness, practice with an AI interviewer, and follow a personalized roadmap toward your target role.
              </p>
              <div className="mt-6 flex gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4">
                <Info className="mt-0.5 size-4 shrink-0 text-warning-foreground/80" />
                <p className="text-sm leading-relaxed text-warning-foreground/90">
                  Please answer every question truthfully. Providing false information may result in disqualification from the placement process and may lead to blacklisting by the placement cell.
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <Section title="Personal information" subtitle="Used across your profile and shared with placement partners.">
              <Grid>
                <Field label="Full name"><Input defaultValue={mockStudent.name} /></Field>
                <Field label="Registration number"><Input defaultValue={mockStudent.regNo} /></Field>
                <Field label="Roll number"><Input defaultValue={mockStudent.rollNo} /></Field>
                <Field label="Email"><Input type="email" defaultValue={mockStudent.email} /></Field>
                <Field label="Phone"><Input defaultValue={mockStudent.phone} /></Field>
                <Field label="Department"><Input defaultValue={mockStudent.department} /></Field>
                <Field label="Course"><Input defaultValue={mockStudent.course} /></Field>
                <Field label="Current semester"><Input defaultValue={mockStudent.semester} /></Field>
              </Grid>
            </Section>
          )}

          {step === 2 && (
            <Section title="Academic record" subtitle="Kept in sync with your official transcript by the placement cell.">
              <Grid>
                <Field label="10th percentage"><Input defaultValue={mockStudent.tenth} /></Field>
                <Field label="12th percentage"><Input defaultValue={mockStudent.twelfth} /></Field>
                <Field label="Current CGPA"><Input defaultValue={mockStudent.cgpa} /></Field>
                <Field label="Expected graduation year"><Input defaultValue={mockStudent.gradYear} /></Field>
                <Field label="Current backlogs"><Input defaultValue={mockStudent.backlogs} /></Field>
              </Grid>
            </Section>
          )}

          {step === 3 && (
            <Section title="Professional links" subtitle="Add up to 5 links. LinkedIn and GitHub are required.">
              <div className="space-y-3">
                {links.map((l, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      className="w-40" value={l.label}
                      disabled={i < 2}
                      onChange={(e) => {
                        const c = [...links]; c[i].label = e.target.value; setLinks(c);
                      }}
                    />
                    <Input
                      value={l.url} placeholder="https://…"
                      onChange={(e) => { const c = [...links]; c[i].url = e.target.value; setLinks(c); }}
                    />
                    {i >= 2 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => setLinks(links.filter((_, x) => x !== i))} aria-label="Remove link">
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addLink} disabled={links.length >= 5}>
                  <Plus className="size-4" /> Add link
                </Button>
              </div>
            </Section>
          )}

          {step === 4 && (
            <Section title="Skills" subtitle="Pick everything you can defend in a short deep-dive. Add custom skills if needed.">
              <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search or add a skill (press Enter to add custom)"
                  className="pl-9"
                  value={skillQuery}
                  onChange={(e) => setSkillQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && skillQuery.trim()) {
                      e.preventDefault();
                      toggleSkill(skillQuery.trim());
                      setSkillQuery("");
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredSkills.map((s) => {
                  const on = skills.includes(s);
                  return (
                    <button
                      type="button" key={s} onClick={() => toggleSkill(s)}
                      className={`rounded-full border px-3 py-1 text-xs transition ${
                        on ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-surface text-foreground/80 hover:border-primary/40"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {skills.filter((s) => !skillList.includes(s)).length > 0 && (
                <div className="mt-6">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Your custom skills</div>
                  <div className="flex flex-wrap gap-2">
                    {skills.filter((s) => !skillList.includes(s)).map((s) => (
                      <Badge key={s} variant="secondary" className="gap-1">
                        {s}
                        <button onClick={() => toggleSkill(s)} aria-label={`Remove ${s}`}><X className="size-3" /></button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Section>
          )}

          {step === 5 && (
            <Section title="Placement preferences" subtitle="Pick one target role and up to two preferred companies.">
              <div className="mb-6 space-y-1.5">
                <Label>Preferred role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {preferredRoles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Content adapts to this role in future updates.</p>
              </div>
              <div>
                <Label>Preferred companies · {companies.length}/2</Label>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {mockCompanies.map((c) => {
                    const on = companies.includes(c.name);
                    return (
                      <button type="button" key={c.id} onClick={() => toggleCompany(c.name)}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                          on ? "border-primary bg-primary-soft" : "border-border bg-surface hover:border-primary/40"
                        }`}>
                        <div className="grid size-9 place-items-center rounded-lg bg-muted text-xs font-semibold">{c.logo}</div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{c.name}</div>
                          <div className="truncate text-xs text-muted-foreground">{c.industry}</div>
                        </div>
                        {on && <Check className="size-4 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Section>
          )}

          {step === 6 && (
            <Section title="Review your profile" subtitle="Double-check before we build your readiness plan.">
              <div className="space-y-4">
                <ReviewRow label="Name" value={mockStudent.name} />
                <ReviewRow label="Registration" value={mockStudent.regNo} />
                <ReviewRow label="Department" value={mockStudent.department} />
                <ReviewRow label="CGPA" value={mockStudent.cgpa} />
                <ReviewRow label="Preferred role" value={role} />
                <ReviewRow label="Preferred companies" value={companies.join(", ") || "—"} />
                <ReviewRow label="Skills" value={skills.join(" · ")} />
                <ReviewRow label="Links" value={links.map((l) => l.label).join(" · ")} />
              </div>
            </Section>
          )}

          <div className="mt-10 flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={back} disabled={step === 0}>
              <ArrowLeft className="size-4" /> Back
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" onClick={next}>Continue <ArrowRight className="size-4" /></Button>
            ) : (
              <Button type="button" onClick={() => { toast.success("Profile submitted"); nav({ to: "/quiz" }); }}>
                Start assessment <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground text-right max-w-md">{value}</div>
    </div>
  );
}
