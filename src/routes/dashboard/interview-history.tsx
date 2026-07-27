import { createFileRoute } from "@tanstack/react-router";
import { StudentShell } from "@/components/layout/StudentShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Play } from "lucide-react";

export const Route = createFileRoute("/dashboard/interview-history")({
  head: () => ({
    meta: [
      { title: "Interview history · PlacePrep AI" },
      { name: "description", content: "AI interview sessions with feedback, transcripts, and scores." },
    ],
  }),
  component: InterviewHistory,
});

const items = [
  { d: "Jul 24, 2026", track: "Full Stack · Behavioral + Technical", score: 74, duration: "38m", clarity: 8.2, depth: 6.8, structure: 7.4 },
  { d: "Jul 09, 2026", track: "System Design Deep-dive", score: 68, duration: "45m", clarity: 7.6, depth: 6.2, structure: 7.0 },
  { d: "Jun 28, 2026", track: "Behavioral Practice", score: 81, duration: "24m", clarity: 8.6, depth: 7.4, structure: 7.9 },
];

function InterviewHistory() {
  return (
    <StudentShell title="Interview history" subtitle="Every AI mock interview, with feedback saved for review.">
      <div className="grid gap-4">
        {items.map((s) => (
          <div key={s.d} className="card-surface card-hover p-5 flex flex-wrap items-center gap-4">
            <div className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary shrink-0"><Video className="size-5" /></div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{s.track}</div>
              <div className="text-xs text-muted-foreground">{s.d} · {s.duration}</div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <Metric k="Clarity" v={s.clarity} />
              <Metric k="Depth" v={s.depth} />
              <Metric k="Structure" v={s.structure} />
            </div>
            <Badge className="bg-success/15 text-success border border-success/20">{s.score}/100</Badge>
            <Button variant="outline" size="sm"><Play className="size-4" /> Replay</Button>
          </div>
        ))}
      </div>
    </StudentShell>
  );
}
function Metric({ k, v }: { k: string; v: number }) {
  return (
    <div className="text-center">
      <div className="text-sm font-semibold tabular-nums">{v}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
    </div>
  );
}
