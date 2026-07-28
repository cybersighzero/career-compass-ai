import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  GraduationCap,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getQuizQuestions, submitQuizAnswer } from "@/lib/api";
import { getStoredStudent } from "@/lib/session";
import { logQuizAttempt } from "@/lib/history";
import { toast } from "sonner";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Assessment · PlacePrep AI" },
      { name: "description", content: "Subjective assessment for your target role, graded by AI." },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const nav = useNavigate();
  const student = getStoredStudent();

  useEffect(() => {
    if (!student) nav({ to: "/" });
  }, [student, nav]);

  const role = student?.role_preference ?? "";

  const {
    data: questions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["quiz-questions", role],
    queryFn: () => getQuizQuestions(role),
    enabled: !!student && !!role,
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [scores, setScores] = useState<Record<number, number | null>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [secondsLeft, setSecondsLeft] = useState(50 * 60);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  if (!student) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">
        Loading assessment…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen grid place-items-center px-6 text-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Couldn't reach the assessment service. Is the backend running?
          </p>
          <Button className="mt-4" variant="outline" onClick={() => nav({ to: "/dashboard" })}>
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen grid place-items-center px-6 text-center">
        <div>
          <p className="text-sm text-muted-foreground">
            {role
              ? `No quiz questions have been added yet for "${role}". Ask your placement cell to add some.`
              : "Set a preferred role in your profile before taking the assessment."}
          </p>
          <Button className="mt-4" variant="outline" onClick={() => nav({ to: "/dashboard" })}>
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const answeredCount = Object.values(answers).filter((v) => v.trim().length > 0).length;

  const toggleFlag = () => {
    const next = new Set(flagged);
    if (next.has(q.id)) next.delete(q.id);
    else next.add(q.id);
    setFlagged(next);
  };

  const submitCurrentAnswer = async () => {
    const text = (answers[q.id] ?? "").trim();
    if (!text || scores[q.id] !== undefined) return;
    try {
      const result = await submitQuizAnswer(student.id, q.id, text);
      setScores((s) => ({ ...s, [q.id]: result.ai_score }));
    } catch {
      // Grading failure shouldn't block navigation — the answer is still recorded server-side attempt.
    }
  };

  const finish = async () => {
    setSubmitting(true);
    await submitCurrentAnswer();
    const gradedScores = Object.values(scores).filter(
      (s): s is number => s !== null && s !== undefined,
    );
    const average =
      gradedScores.length > 0
        ? gradedScores.reduce((a, b) => a + b, 0) / gradedScores.length
        : null;
    logQuizAttempt(student.id, {
      date: new Date().toISOString(),
      role,
      answered: answeredCount,
      total: questions.length,
      averageScore: average,
    });
    toast.success("Quiz submitted");
    nav({ to: "/interview" });
  };

  return (
    <div className="min-h-screen bg-background page-fade-in">
      <header className="border-b border-border bg-surface sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-4" />
            </div>
            <div className="text-sm font-semibold tracking-tight">Placement Assessment</div>
          </div>
          <Badge variant="secondary" className="ml-2">
            {role} · {questions.length} Questions
          </Badge>
          <div className="ml-auto flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Save className="size-3.5" /> Answers are graded by AI on submit
            </div>
            <div
              className={`flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 font-mono tabular-nums ${secondsLeft < 300 ? "text-destructive" : ""}`}
            >
              <Clock className="size-4" /> {mm}:{ss}
            </div>
            <Button size="sm" onClick={finish} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit quiz"}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[1fr_280px]">
        <div className="card-surface p-8">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
            <div>
              Question {current + 1} of {questions.length}
            </div>
            <button
              onClick={toggleFlag}
              className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition ${flagged.has(q.id) ? "text-warning-foreground bg-warning/20" : "hover:bg-accent"}`}
            >
              <Bookmark className={`size-3.5 ${flagged.has(q.id) ? "fill-current" : ""}`} />{" "}
              {flagged.has(q.id) ? "Flagged" : "Flag"}
            </button>
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight leading-relaxed">
            {q.question_text}
          </h2>
          <Textarea
            className="mt-6 min-h-56 resize-none bg-background"
            placeholder="Type your answer here. Structure it clearly — the AI evaluates depth, structure and clarity."
            value={answers[q.id] ?? ""}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
          />
          {scores[q.id] !== undefined && scores[q.id] !== null && (
            <div className="mt-3 text-xs text-success">
              AI score for this answer: {scores[q.id]}/10
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={async () => {
                await submitCurrentAnswer();
                setCurrent(Math.max(0, current - 1));
              }}
              disabled={current === 0}
            >
              <ArrowLeft className="size-4" /> Previous
            </Button>
            {current < questions.length - 1 ? (
              <Button
                onClick={async () => {
                  await submitCurrentAnswer();
                  setCurrent(current + 1);
                }}
              >
                Next <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button onClick={finish} disabled={submitting}>
                {submitting ? (
                  "Submitting…"
                ) : (
                  <>
                    Finish & continue <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card-surface p-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">
                {answeredCount}/{questions.length}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="card-surface p-4">
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Question navigator
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((qq, i) => {
                const answered = (answers[qq.id] ?? "").trim().length > 0;
                const isFlagged = flagged.has(qq.id);
                const isCurrent = i === current;
                return (
                  <button
                    key={qq.id}
                    onClick={async () => {
                      await submitCurrentAnswer();
                      setCurrent(i);
                    }}
                    className={`relative size-9 rounded-md text-xs font-medium transition ${
                      isCurrent
                        ? "ring-2 ring-primary bg-primary text-primary-foreground"
                        : answered
                          ? "bg-primary-soft text-primary"
                          : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                    aria-label={`Question ${i + 1}`}
                  >
                    {i + 1}
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 size-2 rounded-full bg-warning" />
                    )}
                    {answered && !isCurrent && (
                      <CheckCircle2 className="absolute -bottom-1 -right-1 size-3 text-success bg-background rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 space-y-1.5 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" /> Answered
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-warning" /> Flagged
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-muted-foreground/40" /> Not attempted
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
