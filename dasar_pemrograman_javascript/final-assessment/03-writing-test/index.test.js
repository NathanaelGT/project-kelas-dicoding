import { test } from 'node:test';
import assert from 'node:assert';
import { sum } from './index.js';

test('should add correctly', () => {
  const operandA = 1;
  const operandB = 1;

  const actualValue = sum(operandA, operandB);
  const expectedValue = 2;

  assert.equal(actualValue, expectedValue);
});
