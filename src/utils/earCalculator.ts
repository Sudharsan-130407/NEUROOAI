/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Eye Aspect Ratio (EAR) Calculator & Blink Pattern Detection Engine
 * Based on Soukupová & Čech (2016) Real-Time Eye Blink Detection using Facial Landmarks
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface EyeLandmarks {
  // 6 canonical landmarks for eye aspect ratio:
  // p1: outer corner, p2: top-outer, p3: top-inner,
  // p4: inner corner, p5: bottom-inner, p6: bottom-outer
  p1: Point2D;
  p2: Point2D;
  p3: Point2D;
  p4: Point2D;
  p5: Point2D;
  p6: Point2D;
}

/**
 * Calculates Euclidean distance between two 2D points
 */
export function euclideanDistance(pA: Point2D, pB: Point2D): number {
  const dx = pA.x - pB.x;
  const dy = pA.y - pB.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates Eye Aspect Ratio (EAR) given 6 eye boundary landmarks:
 * EAR = (||p2 - p6|| + ||p3 - p5||) / (2 * ||p1 - p4||)
 */
export function calculateEyeAspectRatio(eye: EyeLandmarks): number {
  const verticalA = euclideanDistance(eye.p2, eye.p6);
  const verticalB = euclideanDistance(eye.p3, eye.p5);
  const horizontal = euclideanDistance(eye.p1, eye.p4);

  if (horizontal <= 0.00001) {
    return 0;
  }

  return (verticalA + verticalB) / (2.0 * horizontal);
}

/**
 * Blink state machine configuration
 */
export interface BlinkDetectorConfig {
  earThreshold: number;         // EAR below this indicates eye closure (default ~0.21)
  minBlinkDurationMs: number;    // Minimum closed duration to count as blink (default 80ms)
  maxBlinkDurationMs: number;    // Maximum closed duration for intentional blink (default 900ms)
  sosMaxIntervalMs: number;      // Maximum time between blinks for 3-blink SOS (default 2500ms)
  requiredSosBlinks: number;     // Number of rapid blinks for emergency signal (3)
}

export const DEFAULT_BLINK_CONFIG: BlinkDetectorConfig = {
  earThreshold: 0.21,
  minBlinkDurationMs: 80,
  maxBlinkDurationMs: 900,
  sosMaxIntervalMs: 2500,
  requiredSosBlinks: 3,
};

export interface BlinkEvent {
  timestamp: number;
  durationMs: number;
  minEar: number;
  isIntentional: boolean;
}

export interface BlinkDetectorState {
  isEyeClosed: boolean;
  eyeClosedStartTime: number | null;
  minEarDuringClosure: number;
  recentBlinks: BlinkEvent[];
  sosTriggered: boolean;
  sosTriggerTimestamp: number | null;
}

export function createInitialBlinkState(): BlinkDetectorState {
  return {
    isEyeClosed: false,
    eyeClosedStartTime: null,
    minEarDuringClosure: 1.0,
    recentBlinks: [],
    sosTriggered: false,
    sosTriggerTimestamp: null,
  };
}

/**
 * Processes a single video frame's EAR measurement through the temporal state machine
 */
export function processEarFrame(
  ear: number,
  currentTimeMs: number,
  currentState: BlinkDetectorState,
  config: BlinkDetectorConfig = DEFAULT_BLINK_CONFIG
): {
  nextState: BlinkDetectorState;
  newBlinkDetected: BlinkEvent | null;
  sosJustTriggered: boolean;
} {
  let nextState: BlinkDetectorState = {
    ...currentState,
    recentBlinks: [...currentState.recentBlinks],
    sosJustTriggered: false,
  } as any;

  // Prune blinks outside the SOS observation window
  nextState.recentBlinks = nextState.recentBlinks.filter(
    (b) => currentTimeMs - b.timestamp <= config.sosMaxIntervalMs
  );

  let newBlinkDetected: BlinkEvent | null = null;
  let sosJustTriggered = false;

  const isClosed = ear < config.earThreshold;

  if (isClosed) {
    if (!currentState.isEyeClosed) {
      // Eye just transitioned to closed
      nextState.isEyeClosed = true;
      nextState.eyeClosedStartTime = currentTimeMs;
      nextState.minEarDuringClosure = ear;
    } else {
      // Eye remains closed, track lowest EAR
      if (ear < nextState.minEarDuringClosure) {
        nextState.minEarDuringClosure = ear;
      }
    }
  } else {
    if (currentState.isEyeClosed && currentState.eyeClosedStartTime !== null) {
      // Eye just opened! Calculate closure duration
      const duration = currentTimeMs - currentState.eyeClosedStartTime;
      nextState.isEyeClosed = false;
      nextState.eyeClosedStartTime = null;

      if (duration >= config.minBlinkDurationMs && duration <= config.maxBlinkDurationMs) {
        const isIntentional = duration >= 250; // Intentional blinks are longer than reflexive (100-200ms)
        newBlinkDetected = {
          timestamp: currentTimeMs,
          durationMs: duration,
          minEar: nextState.minEarDuringClosure,
          isIntentional,
        };

        nextState.recentBlinks.push(newBlinkDetected);

        // Check if we hit the 3-blink SOS condition
        if (nextState.recentBlinks.length >= config.requiredSosBlinks) {
          sosJustTriggered = true;
          nextState.sosTriggered = true;
          nextState.sosTriggerTimestamp = currentTimeMs;
          // Clear recent blinks so we don't immediately re-trigger
          nextState.recentBlinks = [];
        }
      }
      nextState.minEarDuringClosure = 1.0;
    }
  }

  return { nextState, newBlinkDetected, sosJustTriggered };
}
