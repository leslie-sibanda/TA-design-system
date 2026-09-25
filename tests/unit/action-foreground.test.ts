import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const primitives = read('packages/tokens/src/primitive.css');
const token = (css: string, name: string) => css.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1].trim();
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe('action colours', () => {
  it('maps the action background and white foreground through tokens in the shared tokens and the TeacherActive theme', () => {
    for (const file of ['packages/tokens/src/semantic.css', 'packages/themes/src/teacheractive.css']) {
      const css = read(file);
      expect(token(css, '--action'), file).toBe('var(--ta-orange-action)');
      expect(token(css, '--action-foreground'), file).toBe('var(--ta-white)');
    }
    expect(token(primitives, '--ta-white')).toBe('#ffffff');
  });
  it('keeps the brand orange unchanged', () => {
    expect(token(primitives, '--ta-orange')).toBe('#f57d00');
  });
  it('meets WCAG AA for the white label on the action orange', () => {
    expect(contrast(token(primitives, '--ta-white')!, token(primitives, '--ta-orange-action')!)).toBeGreaterThanOrEqual(4.5);
  });
  it('lets orange buttons take their colours from the tokens only', () => {
    expect(read('src/app/global.css')).toMatch(/\.site-action\.primary \{[^}]*background: var\(--action\); color: var\(--action-foreground\)/);
  });
});
