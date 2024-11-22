const { isValidPattern} = require('../../lib/skelo-utils')

describe('isValidPattern function', () => {
  it('returns false for null pattern', () => {
    expect(isValidPattern(null)).not.toBe(true);
  });

  it('returns false for non-string pattern', () => {
    expect(isValidPattern(123)).not.toBe(true);
  });

  it('returns false for pattern containing <script>', () => {
    expect(isValidPattern('abc<script>def')).not.toBe(true);
  });

  it('returns true for empty string pattern', () => {
    expect(isValidPattern('')).toBe(false);
  });

  it('returns true for valid string pattern', () => {
    expect(isValidPattern('abc')).toBe(true);
  });
});