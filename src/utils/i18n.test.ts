/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SUPPORTED_LANGUAGES,
  getTranslation,
  getSpeechLocale,
  type SupportedLanguage,
} from './i18n.ts';

test('supports all 5 requested languages including Tamil, Hindi, Malayalam, Telugu, and English', () => {
  const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
  assert.ok(codes.includes('en'));
  assert.ok(codes.includes('ta'));
  assert.ok(codes.includes('hi'));
  assert.ok(codes.includes('ml'));
  assert.ok(codes.includes('te'));
});

test('retrieves translations correctly in Tamil, Hindi, Malayalam, and Telugu', () => {
  assert.equal(getTranslation('en', 'heyNeuro'), 'Hey Neuro');
  assert.ok(getTranslation('ta', 'heyNeuro').includes('ஹே நியூரோ'));
  assert.ok(getTranslation('hi', 'heyNeuro').includes('हे न्यूरो'));
  assert.ok(getTranslation('ml', 'heyNeuro').includes('ഹേ ന്യൂറോ'));
  assert.ok(getTranslation('te', 'heyNeuro').includes('హే న్యూరో'));
});

test('retrieves speech synthesis locale accurately per language', () => {
  assert.equal(getSpeechLocale('ta'), 'ta-IN');
  assert.equal(getSpeechLocale('hi'), 'hi-IN');
  assert.equal(getSpeechLocale('ml'), 'ml-IN');
  assert.equal(getSpeechLocale('te'), 'te-IN');
  assert.equal(getSpeechLocale('en'), 'en-US');
});
