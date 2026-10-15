/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEyeAspectRatio,
  createInitialBlinkState,
  processEarFrame,
  DEFAULT_BLINK_CONFIG,
  type EyeLandmarks,
} from './earCalculator.ts';

test('calculates correct Eye Aspect Ratio for open eye', () => {
  // An open eye: vertical openings are prominent relative to horizontal width
  const openEye: EyeLandmarks = {
    p1: { x: 30, y: 50 },  // outer corner
    p2: { x: 40, y: 38 },  // top outer
    p3: { x: 60, y: 38 },  // top inner
    p4: { x: 70, y: 50 },  // inner corner
    p5: { x: 60, y: 62 },  // bottom inner
    p6: { x: 40, y: 62 },  // bottom outer
  };

  const ear = calculateEyeAspectRatio(openEye);
  // ||p2-p6|| = 24, ||p3-p5|| = 24, ||p1-p4|| = 40 => (24+24)/(2*40) = 48/80 = 0.60
  assert.equal(Math.round(ear * 100) / 100, 0.6);
  assert.ok(ear > DEFAULT_BLINK_CONFIG.earThreshold);
});

test('calculates correct Eye Aspect Ratio for closed eye', () => {
  // A closed eye: vertical eyelids touch (p2 close to p6, p3 close to p5)
  const closedEye: EyeLandmarks = {
    p1: { x: 30, y: 50 },
    p2: { x: 40, y: 49 },
    p3: { x: 60, y: 49 },
    p4: { x: 70, y: 50 },
    p5: { x: 60, y: 51 },
    p6: { x: 40, y: 51 },
  };

  const ear = calculateEyeAspectRatio(closedEye);
  // ||p2-p6|| = 2, ||p3-p5|| = 2, ||p1-p4|| = 40 => 4 / 80 = 0.05
  assert.equal(Math.round(ear * 100) / 100, 0.05);
  assert.ok(ear < DEFAULT_BLINK_CONFIG.earThreshold);
});

test('tracks single intentional blink correctly through state machine', () => {
  let state = createInitialBlinkState();

  // Frame 1: Eyes open at t=0ms (EAR = 0.32)
  let result = processEarFrame(0.32, 0, state);
  state = result.nextState;
  assert.equal(state.isEyeClosed, false);
  assert.equal(result.newBlinkDetected, null);

  // Frame 2: Eyes close at t=50ms (EAR = 0.15)
  result = processEarFrame(0.15, 50, state);
  state = result.nextState;
  assert.equal(state.isEyeClosed, true);
  assert.equal(state.eyeClosedStartTime, 50);

  // Frame 3: Eyes still closed at t=200ms (EAR = 0.12)
  result = processEarFrame(0.12, 200, state);
  state = result.nextState;
  assert.equal(state.isEyeClosed, true);
  assert.equal(state.minEarDuringClosure, 0.12);

  // Frame 4: Eyes reopen at t=400ms (EAR = 0.30) -> duration 350ms (intentional blink)
  result = processEarFrame(0.30, 400, state);
  state = result.nextState;
  assert.equal(state.isEyeClosed, false);
  assert.ok(result.newBlinkDetected !== null);
  assert.equal(result.newBlinkDetected.durationMs, 350);
  assert.equal(result.newBlinkDetected.isIntentional, true);
  assert.equal(state.recentBlinks.length, 1);
  assert.equal(result.sosJustTriggered, false);
});

test('triggers 3-blink Emergency SOS signal when intentional blinks occur within window', () => {
  let state = createInitialBlinkState();
  let time = 1000;

  // Blink 1 (closure 300ms)
  state = processEarFrame(0.12, time, state).nextState;
  time += 300;
  state = processEarFrame(0.32, time, state).nextState;
  assert.equal(state.recentBlinks.length, 1);

  // Inter-blink pause of 250ms
  time += 250;
  state = processEarFrame(0.32, time, state).nextState;

  // Blink 2 (closure 300ms)
  time += 50;
  state = processEarFrame(0.12, time, state).nextState;
  time += 300;
  state = processEarFrame(0.32, time, state).nextState;
  assert.equal(state.recentBlinks.length, 2);

  // Inter-blink pause of 250ms
  time += 250;
  state = processEarFrame(0.32, time, state).nextState;

  // Blink 3 (closure 300ms)
  time += 50;
  state = processEarFrame(0.12, time, state).nextState;
  time += 300;
  const thirdBlinkRes = processEarFrame(0.32, time, state);

  // Verification: SOS signal must be dispatched!
  assert.equal(thirdBlinkRes.sosJustTriggered, true);
  assert.equal(thirdBlinkRes.nextState.sosTriggered, true);
});
