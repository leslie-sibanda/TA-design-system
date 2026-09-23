import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve, extname } from 'node:path';
test('the static artifact has a homepage, 404 and prefixed application assets', async () => {
  const html = await readFile('out/index.html', 'utf8');
  assert.match(html, /Shared foundations/);
  assert.ok(await readFile('out/404.html', 'utf8'));
  const base = process.env.SITE_BASE_PATH ?? '';
  for (const [, url] of html.matchAll(/(?:src|href)="([^" ]*\/_next\/[^" ]*)"/g)) assert.ok(url.startsWith(base + '/_next/'), url);
});
test('all component routes, public files and static search data are published', async () => {
  for (const name of ['alert', 'button', 'input', 'tabs']) {
    const html = await readFile(`out/components/${name}/index.html`, 'utf8');
    assert.match(html, /Design proposal/);
  }
  const index = JSON.parse(await readFile('out/api/search', 'utf8'));
  assert.ok(JSON.stringify(index).includes('Button'));
  for (const name of ['teacheractive-logo.png', 'teacheractive-icon.png']) assert.ok((await stat(`out/brand/${name}`)).size > 0);
});
test('internal links and assets resolve inside the exported artifact', async () => {
  const base = process.env.SITE_BASE_PATH ?? '';
  async function visit(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const file = join(dir, entry.name);
      if (entry.isDirectory()) { await visit(file); continue; }
      if (!entry.name.endsWith('.html') || entry.name === '404.html') continue;
      const html = await readFile(file, 'utf8');
      for (const [, raw] of html.matchAll(/(?:href|src)="([^" ]+)"/g)) {
        if (!raw.startsWith('/') || raw.startsWith('//')) continue;
        const url = raw.split(/[?#]/)[0];
        if (!url) continue;
        assert.ok(!base || url === base || url.startsWith(base + '/'), `${file}: unprefixed ${url}`);
        const path = decodeURIComponent(url.slice(base.length));
        const target = resolve('out', '.' + path);
        const candidate = extname(target) ? target : join(target, 'index.html');
        assert.ok((await stat(candidate).catch(() => null))?.isFile(), `${file}: missing ${url}`);
      }
    }
  }
  await visit('out');
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
