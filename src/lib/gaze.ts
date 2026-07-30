// Lightweight, browser-only gaze detection built on MediaPipe's FaceLandmarker.
// Ignores blinks and small head movements; fires once per continuous look-away
// streak that exceeds `sustainedMs`, and resets as soon as the candidate looks back.

import { FaceLandmarker, FilesetResolver, type Category } from "@mediapipe/tasks-vision";

const WASM_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.0/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

// Thresholds tuned to ignore blinks and minor head movement while still
// catching a genuine, sustained look-away.
const EYE_GAZE_THRESHOLD = 0.35; // eyeLookOut blendshape score (0-1)
const BLINK_THRESHOLD = 0.5; // eyeBlink blendshape score (0-1)
const YAW_THRESHOLD_DEG = 20; // head turn considered "minor" below this
const SUSTAINED_MS = 4000; // how long the look-away must persist to count

function getScore(categories: Category[], name: string): number {
  return categories.find((c) => c.categoryName === name)?.score ?? 0;
}

// Approximate yaw (left/right head turn) from MediaPipe's facial transformation matrix.
function getYawDegrees(matrix: number[]): number {
  const yawRad = Math.atan2(-matrix[8], matrix[0]);
  return yawRad * (180 / Math.PI);
}

export interface GazeDetectorHandlers {
  onSustainedLookAway: () => void;
}

/**
 * Starts detecting gaze/head-pose on the given <video> element.
 * Returns a cleanup function to stop the loop and release the model.
 */
export function startGazeDetection(video: HTMLVideoElement, handlers: GazeDetectorHandlers): () => void {
  let cancelled = false;
  let rafId = 0;
  let landmarker: FaceLandmarker | null = null;
  let awaySinceMs: number | null = null;
  let violationFired = false;

  (async () => {
    try {
      const fileset = await FilesetResolver.forVisionTasks(WASM_BASE);
      if (cancelled) return;
      landmarker = await FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      });
      if (cancelled) {
        landmarker.close();
        return;
      }
      loop();
    } catch {
      // If the model fails to load (offline, blocked CDN, etc.) we simply skip
      // gaze detection rather than blocking the interview.
    }
  })();

  function loop() {
    if (cancelled || !landmarker) return;

    if (video.readyState >= 2) {
      const result = landmarker.detectForVideo(video, performance.now());
      const categories = result.faceBlendshapes?.[0]?.categories ?? [];

      let lookingAway = false;
      if (categories.length) {
        const blinking =
          Math.max(getScore(categories, "eyeBlinkLeft"), getScore(categories, "eyeBlinkRight")) > BLINK_THRESHOLD;

        if (!blinking) {
          const eyeGaze = Math.max(
            getScore(categories, "eyeLookOutLeft"),
            getScore(categories, "eyeLookOutRight"),
          );
          const matrixData = result.facialTransformationMatrixes?.[0]?.data;
          const yaw = matrixData ? Math.abs(getYawDegrees(matrixData)) : 0;
          lookingAway = eyeGaze > EYE_GAZE_THRESHOLD || yaw > YAW_THRESHOLD_DEG;
        }
      }

      const now = performance.now();
      if (lookingAway) {
        if (awaySinceMs === null) {
          awaySinceMs = now;
        } else if (!violationFired && now - awaySinceMs >= SUSTAINED_MS) {
          violationFired = true;
          handlers.onSustainedLookAway();
        }
      } else {
        // Looked back — reset immediately.
        awaySinceMs = null;
        violationFired = false;
      }
    }

    rafId = requestAnimationFrame(loop);
  }

  return () => {
    cancelled = true;
    cancelAnimationFrame(rafId);
    landmarker?.close();
  };
}