import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { brand } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in · PlacePrep AI" },
      { name: "description", content: "Sign in to your PlacePrep AI student account to continue your placement readiness journey." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background page-fade-in">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-primary-soft via-background to-background border-r border-border">
        <div className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </div>
          <div>
            <div className="font-semibold tracking-tight">{brand.name}</div>
            <div className="text-xs text-muted-foreground">{brand.tagline}</div>
          </div>
        </div>

        <div className="max-w-md">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Your placement journey, guided by AI.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Assess your readiness, practice interviews, and follow a personalized roadmap — all in one calm, focused workspace built for students.
          </p>

          <div className="mt-8 space-y-3">
            {[
              { i: Sparkles, t: "Adaptive quizzes & AI mock interviews" },
              { i: ShieldCheck, t: "Transparent scoring reviewed by faculty" },
            ].map(({ i: I, t }) => (
              <div key={t} className="flex items-center gap-3 text-sm text-foreground/80">
                <div className="grid size-8 place-items-center rounded-lg bg-surface border border-border text-primary"><I className="size-4" /></div>
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} PlacePrep. Built for placement cells.</div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setTimeout(() => nav({ to: "/onboarding" }), 500);
          }}
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in with your college registration number.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="reg">Registration Number</Label>
              <Input id="reg" placeholder="21BCE1042" defaultValue="21BCE1042" autoComplete="username" required />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pw">Password</Label>
                <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
              </div>
              <Input id="pw" type="password" placeholder="••••••••" defaultValue="demopassword" autoComplete="current-password" required />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox defaultChecked /> Remember me on this device
            </label>
          </div>

          <Button type="submit" className="mt-6 w-full" disabled={loading}>
            {loading ? "Signing in…" : (<>Sign in <ArrowRight className="size-4" /></>)}
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Placement officer? <Link to="/admin-login" className="text-primary hover:underline">Admin sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
