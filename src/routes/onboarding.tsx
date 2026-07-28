import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, GraduationCap, Info, Plus, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { brand, skillSuggestions } from "@/lib/constants";
import { getCompanies, registerStudent, ApiError } from "@/lib/api";
import { setStoredStudent } from "@/lib/session";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get set up · PlacePrep AI" },
      {
        name: "description",
        content: "Complete your profile so the AI can personalize your placement readiness plan.",
      },
    ],
  }),
  component: Onboarding,
});

const steps = ["Welcome", "Account", "Academic", "Skills & Projects", "Preferences", "Review"];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();

  // Account
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");

  // Academic
  const [cgpa, setCgpa] = useState("");

  // Skills & projects
  const [skills, setSkills] = useState<string[]>([]);
  const [skillQuery, setSkillQuery] = useState("");
  const [projects, setProjects] = useState("");
  const [certifications, setCertifications] = useState("");

  // Preferences
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");

  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });
  const roleOptions = Array.from(new Set(companies.map((c) => c.role))).filter(Boolean);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const toggleSkill = (s: string) =>
    setSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  const filteredSkills = skillSuggestions.filter((s) =>
    s.toLowerCase().includes(skillQuery.toLowerCase()),
  );

  const canSubmit =
    name.trim() &&
    rollNumber.trim() &&
    password.trim() &&
    cgpa.trim() &&
    skills.length > 0 &&
    projects.trim();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const student = await registerStudent({
        roll_number: rollNumber.trim(),
        password,
        name: name.trim(),
        cgpa: Number(cgpa),
        skills: skills.join(", "),
        projects: projects.trim(),
        certifications: certifications.trim() || undefined,
        company_preference: company || undefined,
        role_preference: role || undefined,
      });
      setStoredStudent(student);
      toast.success("Profile created");
      nav({ to: "/quiz" });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Could not reach the server. Is the backend running?";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background page-fade-in">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-4">
          <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold tracking-tight">{brand.name}</div>
            <div className="text-[11px] text-muted-foreground">
              Set up your profile · Step {step + 1} of {steps.length}
            </div>
          </div>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            Already have an account?
          </Link>
        </div>
        <div className="mx-auto max-w-5xl px-6 pb-4">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-2">
                <div
                  className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold transition-colors ${
                    i < step
                      ? "bg-primary text-primary-foreground"
                      : i === step
                        ? "bg-primary/15 text-primary ring-2 ring-primary/30"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="size-3" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
            {steps.map((s) => (
              <span key={s} className="hidden sm:inline">
                {s}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="card-surface p-8 sm:p-10">
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Welcome to {brand.name}.</h2>
              <p className="mt-2 text-muted-foreground">
                PlacePrep AI helps you assess your placement readiness, practice with an AI
                interviewer, and follow a personalized roadmap toward your target role.
              </p>
              <div className="mt-6 flex gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4">
                <Info className="mt-0.5 size-4 shrink-0 text-warning-foreground/80" />
                <p className="text-sm leading-relaxed text-warning-foreground/90">
                  Please answer every question truthfully. Providing false information may result in
                  disqualification from the placement process and may lead to blacklisting by the
                  placement cell.
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <Section
              title="Create your account"
              subtitle="Your roll number and password are how you'll sign back in."
            >
              <Grid>
                <Field label="Full name">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Sharma"
                  />
                </Field>
                <Field label="Roll number">
                  <Input
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="CSE-B-27"
                  />
                </Field>
                <Field label="Password">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </Field>
              </Grid>
            </Section>
          )}

          {step === 2 && (
            <Section
              title="Academic record"
              subtitle="Used to check eligibility against each company's minimum CGPA."
            >
              <Grid>
                <Field label="Current CGPA">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder="8.5"
                  />
                </Field>
              </Grid>
            </Section>
          )}

          {step === 3 && (
            <Section
              title="Skills & projects"
              subtitle="Pick everything you can defend in a short deep-dive, and describe your project work."
            >
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
                      type="button"
                      key={s}
                      onClick={() => toggleSkill(s)}
                      className={`rounded-full border px-3 py-1 text-xs transition ${
                        on
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-surface text-foreground/80 hover:border-primary/40"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {skills.filter((s) => !skillSuggestions.includes(s)).length > 0 && (
                <div className="mt-6">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                    Your custom skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills
                      .filter((s) => !skillSuggestions.includes(s))
                      .map((s) => (
                        <Badge key={s} variant="secondary" className="gap-1">
                          {s}
                          <button onClick={() => toggleSkill(s)} aria-label={`Remove ${s}`}>
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
              <div className="mt-6 space-y-1.5">
                <Label>Projects</Label>
                <Textarea
                  value={projects}
                  onChange={(e) => setProjects(e.target.value)}
                  placeholder="Briefly describe 1-3 projects you've built."
                  className="min-h-28"
                />
              </div>
              <div className="mt-4 space-y-1.5">
                <Label>
                  Certifications{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  placeholder="AWS Cloud Practitioner, ..."
                />
              </div>
            </Section>
          )}

          {step === 4 && (
            <Section
              title="Placement preferences"
              subtitle="Pick one target role and one preferred company — you can change these later."
            >
              <div className="mb-6 space-y-1.5">
                <Label>Preferred role</Label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder={roleOptions[0] ?? "e.g. Software Engineer"}
                  list="role-options"
                />
                <datalist id="role-options">
                  {roleOptions.map((r) => (
                    <option key={r} value={r} />
                  ))}
                </datalist>
                <p className="text-xs text-muted-foreground">
                  Matched against hiring companies' listed roles for your gap analysis.
                </p>
              </div>
              <div>
                <Label>Preferred company</Label>
                {companies.length > 0 ? (
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    {companies.map((c) => {
                      const on = company === c.name;
                      return (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => setCompany(on ? "" : c.name)}
                          className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                            on
                              ? "border-primary bg-primary-soft"
                              : "border-border bg-surface hover:border-primary/40"
                          }`}
                        >
                          <div className="grid size-9 place-items-center rounded-lg bg-muted text-xs font-semibold">
                            {c.name
                              .split(" ")
                              .map((x) => x[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{c.name}</div>
                            <div className="truncate text-xs text-muted-foreground">
                              {c.role} · min CGPA {c.min_cgpa}
                            </div>
                          </div>
                          {on && <Check className="size-4 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    No companies have been added by the placement cell yet.
                  </p>
                )}
              </div>
            </Section>
          )}

          {step === 5 && (
            <Section
              title="Review your profile"
              subtitle="Double-check before we create your account."
            >
              <div className="space-y-4">
                <ReviewRow label="Name" value={name || "—"} />
                <ReviewRow label="Roll number" value={rollNumber || "—"} />
                <ReviewRow label="CGPA" value={cgpa || "—"} />
                <ReviewRow label="Preferred role" value={role || "—"} />
                <ReviewRow label="Preferred company" value={company || "—"} />
                <ReviewRow label="Skills" value={skills.join(" · ") || "—"} />
                <ReviewRow label="Certifications" value={certifications || "—"} />
              </div>
            </Section>
          )}

          <div className="mt-10 flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={back} disabled={step === 0}>
              <ArrowLeft className="size-4" /> Back
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" onClick={next}>
                Continue <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={!canSubmit || submitting}>
                {submitting ? (
                  "Creating account…"
                ) : (
                  <>
                    Start assessment <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
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
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-sm text-foreground text-right max-w-md">{value}</div>
    </div>
  );
}
