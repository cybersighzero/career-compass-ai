// Typed client for the placement-agent-backend FastAPI service.
// Every function here maps 1:1 to a real endpoint in main.py — nothing here is mocked.

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    query?: Record<string, string | number | boolean | undefined>;
  } = {},
): Promise<T> {
  const { method = "GET", body, query } = options;

  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString(), {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data.detail ?? detail;
    } catch {
      // response wasn't JSON — fall back to statusText
    }
    throw new ApiError(res.status, typeof detail === "string" ? detail : JSON.stringify(detail));
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---------- Types (mirrors backend schemas.py / models.py) ----------

export interface Student {
  id: number;
  roll_number: string;
  name: string;
  cgpa: number;
  skills: string;
  projects: string;
  certifications?: string | null;
  company_preference?: string | null;
  role_preference?: string | null;
  quiz_score?: number | null;
  interview_status?: string | null;
  readiness_status?: string | null;
  missing_skills?: string | null;
}

export interface StudentCreatePayload {
  roll_number: string;
  password: string;
  name: string;
  cgpa: number;
  skills: string;
  projects: string;
  certifications?: string;
  company_preference?: string;
  role_preference?: string;
}

export interface StudentUpdatePayload {
  cgpa?: number;
  skills?: string;
  projects?: string;
  certifications?: string;
  quiz_score?: number;
}

export interface Company {
  id: number;
  name: string;
  role: string;
  required_skills: string;
  min_cgpa: number;
}

export interface CompanyCreatePayload {
  name: string;
  role: string;
  required_skills: string;
  min_cgpa: number;
}

export interface QuizQuestion {
  id: number;
  role: string;
  question_text: string;
}

export interface QuizSubmitResult {
  id: number;
  student_id: number;
  question_id: number;
  answer_text: string;
  ai_score: number | null;
}

export interface Interview {
  id: number;
  student_id: number;
  camera_verified: boolean;
  transcript: string | null;
  status: string;
  ai_feedback: string | null;
  gaze_violations?: number;
}

export interface NextQuestionResult {
  interview_id: number;
  question: string;
}

export interface InterviewFinishResult {
  id: number;
  student_id: number;
  status: string;
  camera_verified: boolean;
  transcript: string | null;
  ai_feedback: string | null;
}

export interface GapAnalysisResult {
  student_id: number;
  advice: string;
}

export interface ReadinessSummary {
  total_students: number;
  ready_count: number;
  not_ready_count: number;
  not_evaluated_count: number;
  ready_students: Student[];
  not_ready_students: Student[];
  not_evaluated_students: Student[];
}

// ---------- Auth / students ----------

export const registerStudent = (payload: StudentCreatePayload) =>
  request<Student>("/register", { method: "POST", body: payload });

export const loginStudent = (roll_number: string, password: string) =>
  request<Student>("/login", { method: "POST", body: { roll_number, password } });

export const getStudents = () => request<Student[]>("/students");

export const updateStudentProfile = (studentId: number, payload: StudentUpdatePayload) =>
  request<Student>(`/students/${studentId}/update-profile`, { method: "PUT", body: payload });

export const confirmPreference = (
  studentId: number,
  companyPreference: string,
  rolePreference: string,
) =>
  request<Student>(`/students/${studentId}/confirm-preference`, {
    method: "PUT",
    query: { company_preference: companyPreference, role_preference: rolePreference },
  });

export const checkReadiness = (studentId: number) =>
  request<Student>(`/students/${studentId}/check-readiness`, { method: "PUT" });

export const getGapAnalysis = (studentId: number) =>
  request<GapAnalysisResult>(`/students/${studentId}/gap-analysis`);

// ---------- Companies ----------

export const getCompanies = () => request<Company[]>("/companies");

export const createCompany = (payload: CompanyCreatePayload) =>
  request<Company>("/companies", { method: "POST", body: payload });

export const deleteCompany = (companyId: number) =>
  request<{ message: string }>(`/companies/${companyId}`, { method: "DELETE" });

// ---------- Quiz ----------

export const getQuizQuestions = (role: string) =>
  request<QuizQuestion[]>(`/quiz/questions/${encodeURIComponent(role)}`);

export const addQuizQuestion = (role: string, questionText: string) =>
  request<QuizQuestion>("/quiz/questions", {
    method: "POST",
    query: { role, question_text: questionText },
  });

export const submitQuizAnswer = (studentId: number, questionId: number, answerText: string) =>
  request<QuizSubmitResult>("/quiz/submit", {
    method: "POST",
    query: { student_id: studentId, question_id: questionId, answer_text: answerText },
  });

// ---------- Interview ----------

export const startInterview = (studentId: number) =>
  request<Interview>("/interview/start", { method: "POST", query: { student_id: studentId } });

export const getNextQuestion = (interviewId: number, studentAnswer = "") =>
  request<NextQuestionResult>(`/interview/${interviewId}/next-question`, {
    method: "POST",
    query: { student_answer: studentAnswer },
  });

export const finishInterview = (interviewId: number) =>
  request<InterviewFinishResult>(`/interview/${interviewId}/finish`, { method: "PUT" });

export const reportGazeViolation = (interviewId: number) =>
  request<Interview>(`/interview/${interviewId}/gaze-violation`, { method: "POST" });

// ---------- Admin ----------

export const getReadinessSummary = () => request<ReadinessSummary>("/admin/readiness-summary");
