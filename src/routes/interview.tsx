import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bot, Camera, Clock, Mic, PhoneOff, Send, VideoOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { interviewTranscript } from "@/lib/mock-data";

export const Route = createFileRoute("/interview")({
  head: () => ({
    meta: [
      { title: "AI Interview · PlacePrep AI" },
      { name: "description", content: "Live AI interview simulation with real-time transcript and evaluation." },
    ],
  }),
  component: InterviewPage,
});

const questions = [
  "Walk me through a project you're most proud of and the trade-offs you made.",
  "How would you design a rate limiter for a service handling 100k RPS?",
  "Describe a time you disagreed with a teammate and how you resolved it.",
  "What's the difference between optimistic and pessimistic concurrency control?",
  "Where do you see yourself in three years, and what are you doing to get there?",
];

function InterviewPage() {
  const [qIdx, setQIdx] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState(interviewTranscript);
  const [draft, setDraft] = useState("");
  const nav = useNavigate();

  useEffect(() => { const t = setInterval(() => setSeconds((s) => s + 1), 1000); return () => clearInterval(t); }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const send = () => {
    if (!draft.trim()) return;
    setTranscript([...transcript, { who: "user", text: draft.trim() }]);
    setDraft("");
    setTimeout(() => {
      setTranscript((t) => [...t, { who: "ai", text: "Thanks — let's dig one level deeper. Can you walk me through the trade-offs you considered?" }]);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-background page-fade-in">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-3">
          <Badge className="bg-destructive text-destructive-foreground gap-1.5"><span className="size-1.5 rounded-full bg-current animate-pulse" /> LIVE</Badge>
          <div className="text-sm font-semibold tracking-tight">AI Interview · Full Stack Track</div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-mono tabular-nums">
              <Clock className="size-4" /> {mm}:{ss}
            </div>
            <Button variant="destructive" size="sm" onClick={() => nav({ to: "/results" })}>
              <PhoneOff className="size-4" /> End Interview
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div className="card-surface overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 grid place-items-center">
              <div className="text-center text-white/70">
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-white/10 mb-3"><VideoOff className="size-6" /></div>
                <div className="text-sm">Camera preview is disabled for this demo</div>
                <div className="text-xs text-white/40 mt-1">Your session would appear here in a real interview</div>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <div className="rounded-md bg-black/50 backdrop-blur px-2 py-1 text-xs text-white/90 flex items-center gap-1.5">
                  <User className="size-3" /> You
                </div>
              </div>
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button className="grid size-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><Mic className="size-4" /></button>
                <button className="grid size-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><Camera className="size-4" /></button>
              </div>
            </div>
          </div>

          <div className="card-surface p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground"><Bot className="size-5" /></div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">Nova · AI Interviewer</div>
                <div className="text-xs text-muted-foreground pulse-dot text-primary">Listening</div>
              </div>
              <Badge variant="secondary">Question {qIdx + 1} of {questions.length}</Badge>
            </div>
            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Current question</div>
              <div className="text-base font-medium leading-relaxed">{questions[qIdx]}</div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setQIdx(Math.max(0, qIdx - 1))} disabled={qIdx === 0}>Previous</Button>
              <Button size="sm" onClick={() => setQIdx(Math.min(questions.length - 1, qIdx + 1))} disabled={qIdx === questions.length - 1}>Next question</Button>
              <div className="ml-auto flex items-center gap-1">
                {questions.map((_, i) => (
                  <span key={i} className={`h-1 w-6 rounded-full ${i <= qIdx ? "bg-primary" : "bg-muted"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="card-surface flex flex-col">
          <div className="border-b border-border px-5 py-4">
            <div className="text-sm font-semibold">Live transcript</div>
            <div className="text-xs text-muted-foreground">AI is transcribing your responses in real time.</div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-5 max-h-[520px]">
            {transcript.map((t, i) => (
              <div key={i} className={`flex gap-2.5 ${t.who === "user" ? "justify-end" : ""}`}>
                {t.who === "ai" && <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Bot className="size-3.5" /></div>}
                <div className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  t.who === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"
                }`}>{t.text}</div>
                {t.who === "user" && <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground text-[10px] font-semibold">AS</div>}
              </div>
            ))}
          </div>
          <div className="border-t border-border p-3 flex gap-2">
            <input
              value={draft} onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type response (demo)…"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button size="icon" onClick={send} aria-label="Send"><Send className="size-4" /></Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
