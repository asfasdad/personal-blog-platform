import { describe, expect, it } from 'vitest';

describe('unit smoke', () => {
  it('keeps arithmetic stable', () => {
    expect(2 + 2).toBe(4);
  });
});
