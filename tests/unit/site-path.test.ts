import { describe, expect, it } from 'vitest';
import { validateBasePath, publicPath } from '../../src/lib/site-path.mjs';

describe('public site URLs', () => {
  it('supports root and project-site assets without double prefixing', () => {
    expect(publicPath('/brand/logo.png', '')).toBe('/brand/logo.png');
    expect(publicPath('/brand/logo.png', '/TA-design-system')).toBe('/TA-design-system/brand/logo.png');
    expect(publicPath('/TA-design-system/brand/logo.png', '/TA-design-system')).toBe('/TA-design-system/brand/logo.png');
  });
  it('rejects malformed paths instead of constructing unsafe URLs', () => {
    for (const path of ['/', 'TA-design-system', '//host', '/a/../b', '/x?y', '/x/']) {
      expect(() => validateBasePath(path)).toThrow();
    }
    expect(validateBasePath('')).toBe('');
    expect(validateBasePath('/TA-design-system')).toBe('/TA-design-system');
    expect(() => publicPath('https://evil.example', '')).toThrow();
  });
});
