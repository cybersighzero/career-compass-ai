import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Camera, Clock, Mic, PhoneOff, Send, User, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { startInterview, getNextQuestion, finishInterview, reportGazeViolation } from "@/lib/api";
import { getStoredStudent } from "@/lib/session";
import { logInterviewAttempt } from "@/lib/history";
import { startGazeDetection } from "@/lib/gaze";
import { toast } from "sonner";

export const Route = createFileRoute("/interview")({
  head: () => ({
    meta: [
      { title: "AI Interview · PlacePrep AI" },
      {
        name: "description",
        content: "Live AI interview simulation with real-time transcript and evaluation.",
      },
    ],
  }),
  component: InterviewPage,
});

type Message = { who: "ai" | "user"; text: string };

function InterviewPage() {
  const nav = useNavigate();
  const student = getStoredStudent();

  const [interviewId, setInterviewId] = useState<number | null>(null);
  const [starting, setStarting] = useState(true);
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [ending, setEnding] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const questionCount = useRef(0);

  // Camera/mic permission gate — the interview is blocked until both are granted.
  const [permission, setPermission] = useState<"pending" | "granted" | "denied">("pending");
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!student) return;
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        setPermission("granted");
      } catch {
        if (!cancelled) {
          setPermission("denied");
          setPermissionError("Camera and microphone access is required to start the AI interview.");
        }
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!student) {
      nav({ to: "/" });
      return;
    }
    if (permission !== "granted") return;
    let cancelled = false;
    (async () => {
      try {
        const interview = await startInterview(student.id);
        const first = await getNextQuestion(interview.id, "");
        if (cancelled) return;
        setInterviewId(interview.id);
        setTranscript([{ who: "ai", text: first.question }]);
        questionCount.current = 1;
      } catch {
        toast.error("Couldn't start the interview. Is the backend running?");
      } finally {
        if (!cancelled) setStarting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (permission === "granted" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [permission]);

  // Start gaze/head-pose monitoring once the interview is live and the camera is up.
  useEffect(() => {
    if (permission !== "granted" || !interviewId || !videoRef.current) return;
    const stop = startGazeDetection(videoRef.current, {
      onSustainedLookAway: () => {
        reportGazeViolation(interviewId)
          .then((updated) => {
            if (updated.status === "disqualified") {
              toast.error("Interview disqualified due to repeated look-away violations.");
              nav({ to: "/results" });
            } else {
              toast.warning("Please keep looking at the screen during the interview.");
            }
          })
          .catch(() => {
            // Don't interrupt the interview if the violation report fails to send.
          });
      },
    });
    return stop;
  }, [permission, interviewId, nav]);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  if (!student) return null;

  if (permission === "pending") {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-6 text-center">
        <div>
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Camera className="size-6" />
          </div>
          <p className="text-sm text-muted-foreground">Requesting camera and microphone access…</p>
        </div>
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-6 text-center">
        <div className="max-w-sm">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-destructive/15 text-destructive">
            <ShieldAlert className="size-6" />
          </div>
          <p className="text-sm font-medium">Camera & microphone access required</p>
          <p className="mt-2 text-sm text-muted-foreground">{permissionError}</p>
          <Button className="mt-6" variant="outline" onClick={() => nav({ to: "/dashboard" })}>
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  const send = async () => {
    if (!draft.trim() || !interviewId || sending) return;
    const answer = draft.trim();
    setTranscript((t) => [...t, { who: "user", text: answer }]);
    setDraft("");
    setSending(true);
    try {
      const next = await getNextQuestion(interviewId, answer);
      setTranscript((t) => [...t, { who: "ai", text: next.question }]);
      questionCount.current += 1;
    } catch {
      toast.error("Couldn't reach the interviewer. Try again.");
    } finally {
      setSending(false);
    }
  };

  const endInterview = async () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (!interviewId) return nav({ to: "/results" });
    setEnding(true);
    try {
      const result = await finishInterview(interviewId);
      logInterviewAttempt(student.id, {
        date: new Date().toISOString(),
        interviewId,
        status: result.status,
        questionCount: questionCount.current,
        aiFeedback: result.ai_feedback,
      });
      sessionStorage.setItem("placeprep.lastInterview", JSON.stringify(result));
      nav({ to: "/results" });
    } catch {
      toast.error("Couldn't finish the interview. Please try again.");
    } finally {
      setEnding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background page-fade-in">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-3">
          <Badge className="bg-destructive text-destructive-foreground gap-1.5">
            <span className="size-1.5 rounded-full bg-current animate-pulse" /> LIVE
          </Badge>
          <div className="text-sm font-semibold tracking-tight">
            AI Interview{student.role_preference ? ` · ${student.role_preference}` : ""}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-mono tabular-nums">
              <Clock className="size-4" /> {mm}:{ss}
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={endInterview}
              disabled={ending || starting}
            >
              <PhoneOff className="size-4" /> {ending ? "Ending…" : "End Interview"}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div className="card-surface overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <div className="rounded-md bg-black/50 backdrop-blur px-2 py-1 text-xs text-white/90 flex items-center gap-1.5">
                  <User className="size-3" /> You
                </div>
              </div>
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button className="grid size-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
                  <Mic className="size-4" />
                </button>
                <button className="grid size-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
                  <Camera className="size-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="card-surface p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
                <Bot className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">Nova · AI Interviewer</div>
                <div className="text-xs text-muted-foreground pulse-dot text-primary">
                  {starting ? "Starting…" : sending ? "Thinking…" : "Listening"}
                </div>
              </div>
              <Badge variant="secondary">Question {questionCount.current}</Badge>
            </div>
            <div className="mt-4 rounded-xl border border-border bg-background p-4 min-h-16">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                Current question
              </div>
              <div className="text-base font-medium leading-relaxed">
                {starting
                  ? "Setting up your interview…"
                  : (transcript.filter((m) => m.who === "ai").at(-1)?.text ?? "")}
              </div>
            </div>
          </div>
        </div>

        <aside className="card-surface flex flex-col">
          <div className="border-b border-border px-5 py-4">
            <div className="text-sm font-semibold">Live transcript</div>
            <div className="text-xs text-muted-foreground">
              Backed by the AI interviewer in real time.
            </div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-5 max-h-[520px]">
            {transcript.map((t, i) => (
              <div key={i} className={`flex gap-2.5 ${t.who === "user" ? "justify-end" : ""}`}>
                {t.who === "ai" && (
                  <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                    <Bot className="size-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    t.who === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {t.text}
                </div>
                {t.who === "user" && (
                  <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground text-[10px] font-semibold">
                    {student.name
                      .split(" ")
                      .map((x) => x[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-border p-3 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={starting ? "Waiting for interview to start…" : "Type your response…"}
              disabled={starting || sending}
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            />
            <Button size="icon" onClick={send} disabled={starting || sending} aria-label="Send">
              <Send className="size-4" />
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
