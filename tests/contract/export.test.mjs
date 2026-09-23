import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
test('the static artifact has a homepage, 404 and prefixed application assets', async () => {
  const html = await readFile('out/index.html', 'utf8');
  assert.match(html, /Shared foundations/);
  assert.ok(await readFile('out/404.html', 'utf8'));
  const base = process.env.SITE_BASE_PATH ?? '';
  for (const [, url] of html.matchAll(/(?:src|href)="([^" ]*\/_next\/[^" ]*)"/g)) assert.ok(url.startsWith(base + '/_next/'), url);
});
test('the publication artifact excludes private repository and session content', async () => {
  async function visit(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      assert.ok(!['.git', '.superpowers', 'AGENTS.md', 'delivery', 'node_modules'].includes(entry.name), entry.name);
      assert.ok(!entry.name.startsWith('.env'), entry.name);
      if (entry.isDirectory()) await visit(join(dir, entry.name));
    }
  }
  await visit('out');
});
