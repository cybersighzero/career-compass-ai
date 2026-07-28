// The backend stores QuizResponse / Interview rows but doesn't expose a "list my past
// attempts" endpoint. Rather than fabricate history, we keep a real local log — one
// entry per session actually completed in this browser — scoped per student.

export interface QuizHistoryEntry {
  date: string; // ISO
  role: string;
  answered: number;
  total: number;
  averageScore: number | null;
}

export interface InterviewHistoryEntry {
  date: string; // ISO
  interviewId: number;
  status: string;
  questionCount: number;
  aiFeedback: string | null;
}

function key(studentId: number, kind: "quiz" | "interview") {
  return `placeprep.history.${kind}.${studentId}`;
}

function read<T>(k: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(k) ?? "[]") as T[];
  } catch {
    return [];
  }
}

function write<T>(k: string, items: T[]) {
  window.localStorage.setItem(k, JSON.stringify(items));
}

export function logQuizAttempt(studentId: number, entry: QuizHistoryEntry) {
  const k = key(studentId, "quiz");
  write(k, [entry, ...read<QuizHistoryEntry>(k)].slice(0, 50));
}

export function getQuizHistory(studentId: number): QuizHistoryEntry[] {
  return read<QuizHistoryEntry>(key(studentId, "quiz"));
}

export function logInterviewAttempt(studentId: number, entry: InterviewHistoryEntry) {
  const k = key(studentId, "interview");
  write(k, [entry, ...read<InterviewHistoryEntry>(k)].slice(0, 50));
}

export function getInterviewHistory(studentId: number): InterviewHistoryEntry[] {
  return read<InterviewHistoryEntry>(key(studentId, "interview"));
}
