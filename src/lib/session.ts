// Lightweight client-side session handling.
// The backend has no token/session concept — /login and /register just return the
// student row — so we persist that row in localStorage and use it as "who's signed in".

import type { Student } from "@/lib/api";

const STUDENT_KEY = "placeprep.student";
const ADMIN_KEY = "placeprep.admin";

export function getStoredStudent(): Student | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STUDENT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Student;
  } catch {
    return null;
  }
}

export function setStoredStudent(student: Student) {
  window.localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
}

export function clearStoredStudent() {
  window.localStorage.removeItem(STUDENT_KEY);
}

export function isAdminSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ADMIN_KEY) === "1";
}

export function setAdminSignedIn() {
  window.localStorage.setItem(ADMIN_KEY, "1");
}

export function clearAdminSignedIn() {
  window.localStorage.removeItem(ADMIN_KEY);
}
