/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateJointAngle,
  calculateTrunkLeanAngle,
  calculateRomParity,
  evaluateStrokeSubstitution,
} from './biomechanics.ts';

test('calculates 90-degree right angle at elbow/joint vertex', () => {
  // Shoulder at (0, 10), Elbow at (0, 0), Wrist at (10, 0) => exactly 90 degrees
  const shoulder = { x: 0, y: 10 };
  const elbow = { x: 0, y: 0 };
  const wrist = { x: 10, y: 0 };

  const angle = calculateJointAngle(shoulder, elbow, wrist);
  assert.equal(angle, 90);
});

test('calculates 180-degree straight arm extension', () => {
  // Shoulder at (-10, 0), Elbow at (0, 0), Wrist at (10, 0) => 180 degrees
  const shoulder = { x: -10, y: 0 };
  const elbow = { x: 0, y: 0 };
  const wrist = { x: 10, y: 0 };

  const angle = calculateJointAngle(shoulder, elbow, wrist);
  assert.equal(angle, 180);
});

test('calculates ROM parity percentage correctly', () => {
  assert.equal(calculateRomParity(76, 90), 84);
  assert.equal(calculateRomParity(90, 90), 100);
  assert.equal(calculateRomParity(100, 90), 100); // capped at 100
  assert.equal(calculateRomParity(45, 90), 50);
});

test('detects trunk lateral lean compensation threshold in stroke patients', () => {
  // Balanced shoulders (purely horizontal)
  const leftShoulderSafe = { x: 100, y: 150 };
  const rightShoulderSafe = { x: 200, y: 153 }; // only 3px delta -> ~1.7 deg
  const safeEval = evaluateStrokeSubstitution(leftShoulderSafe, rightShoulderSafe, 4.0);
  assert.equal(safeEval.isSafe, true);
  assert.equal(safeEval.compensationAlert, undefined);

  // Compensated lean (e.g. leaning 15px over 100px width => ~8.5 degrees lean)
  const leftShoulderLean = { x: 100, y: 150 };
  const rightShoulderLean = { x: 200, y: 165 };
  const leanEval = evaluateStrokeSubstitution(leftShoulderLean, rightShoulderLean, 4.0);
  assert.equal(leanEval.isSafe, false);
  assert.ok(leanEval.trunkLeanDegrees > 4.0);
  assert.ok(leanEval.compensationAlert?.includes('Keep spine aligned'));
});
