/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateStrokeRelapse } from './strokeRelapseDetector.ts';

test('flags normal recovery state when asymmetry and drift are baseline', () => {
  const result = evaluateStrokeRelapse({
    facialAsymmetryPercent: 8,
    armDriftAngleDegrees: 2,
    speechDysarthriaScore: 12,
    suddenImmobilitySeconds: 5,
  });

  assert.equal(result.isRelapseSuspected, false);
  assert.equal(result.severity, 'NORMAL');
  assert.equal(result.detectedSymptoms.length, 0);
});

test('detects acute stroke relapse emergency when multiple FAST symptoms trigger', () => {
  const result = evaluateStrokeRelapse({
    facialAsymmetryPercent: 34, // Face droop
    armDriftAngleDegrees: 22,    // Arm drift
    speechDysarthriaScore: 40,
    suddenImmobilitySeconds: 10,
  });

  assert.equal(result.isRelapseSuspected, true);
  assert.equal(result.severity, 'ACUTE_STROKE_EMERGENCY');
  assert.equal(result.detectedSymptoms.length, 2);
  assert.ok(result.smsAlertPayload.includes('NEUROSHIELD CRITICAL ALERT'));
  assert.ok(result.smsAlertPayload.includes('Acute Facial Droop Detected'));
  assert.ok(result.smsAlertPayload.includes('Unilateral Arm Drift'));
});
