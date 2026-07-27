import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shield, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: "Admin sign in · PlacePrep AI" },
      { name: "description", content: "Placement cell console — sign in to manage students, companies and analytics." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen grid place-items-center bg-background p-6 page-fade-in">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setTimeout(() => nav({ to: "/admin" }), 500);
        }}
        className="w-full max-w-md card-surface p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-foreground text-background">
            <Shield className="size-5" />
          </div>
          <div>
            <div className="font-semibold tracking-tight">Placement Cell Console</div>
            <div className="text-xs text-muted-foreground">Authorized personnel only</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" defaultValue="placement.officer@college.edu" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw">Password</Label>
            <Input id="pw" type="password" defaultValue="demopassword" required />
          </div>
        </div>
        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? "Signing in…" : (<>Enter console <ArrowRight className="size-4" /></>)}
        </Button>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Are you a student? <Link to="/" className="text-primary hover:underline">Student sign in</Link>
        </p>
      </form>
    </div>
  );
}
