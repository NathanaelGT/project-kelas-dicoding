import { test } from 'node:test';
import assert from 'node:assert';
import sum from './index.js';

test('should add correctly', () => {
  assert.equal(sum(1, 1), 2);
});

test('should return 0 if invalid', () => {
  assert.equal(sum('1', 1), 0);
  assert.equal(sum(1, '1'), 0);
  assert.equal(sum('1', '1'), 0);
});

test('should return 0 if less than 0', () => {
  assert.equal(sum(-1, 5), 0);
  assert.equal(sum(1, -5), 0);
  assert.equal(sum(-1, -5), 0);
});
