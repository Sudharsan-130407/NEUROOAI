/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { isWakeWordDetected, parseVoiceCommand } from './voiceAssistant.ts';

test('detects "Hey Neuro" wake-word in English and regional variations', () => {
  assert.equal(isWakeWordDetected('Hey Neuro, what is my routine?'), true);
  assert.equal(isWakeWordDetected('neuro please help me'), true);
  assert.equal(isWakeWordDetected('ஹே நியூரோ உதவி செய்'), true);
  assert.equal(isWakeWordDetected('just some random sentence'), false);
});

test('parses emergency commands and returns multilingual responses', () => {
  const enCmd = parseVoiceCommand('help emergency sos', 'en');
  assert.equal(enCmd.intent, 'EMERGENCY_SOS');
  assert.ok(enCmd.responseMessage.includes('emergency distress protocol'));

  const taCmd = parseVoiceCommand('அவசரம் காப்பாத்து', 'ta');
  assert.equal(taCmd.intent, 'EMERGENCY_SOS');
  assert.ok(taCmd.responseMessage.includes('அவசர உதவி'));
});

test('parses exercise and hydration commands', () => {
  const ex = parseVoiceCommand('start therapy exercise', 'en');
  assert.equal(ex.intent, 'START_EXERCISE');

  const water = parseVoiceCommand('I want to drink water', 'en');
  assert.equal(water.intent, 'LOG_WATER');
  assert.ok(water.responseMessage.includes('250ml'));
});
