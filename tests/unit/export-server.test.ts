import { afterAll, beforeAll, expect, it } from 'vitest';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createStaticServer } from '../../scripts/serve-export.mjs';
import type { Server } from 'node:http';
let root: string, server: Server, url: string;
beforeAll(async () => {
  root = await mkdtemp(join(tmpdir(), 'ta-export-'));
  await mkdir(join(root, 'components/button'), { recursive: true });
  await writeFile(join(root, 'index.html'), 'home');
  await writeFile(join(root, 'components/button/index.html'), 'button');
  await writeFile(join(root, '404.html'), 'not found');
  server = createStaticServer(root, '/TA-design-system');
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Missing test port');
  url = `http://127.0.0.1:${address.port}`;
});
afterAll(async () => { await new Promise<void>(resolve => server?.close(() => resolve())); await rm(root, { recursive: true, force: true }); });
it('serves nested directories and ignores query strings under the prefix', async () => {
  const res = await fetch(url + '/TA-design-system/components/button/?q=1');
  expect(res.status).toBe(200);
  expect(await res.text()).toBe('button');
});
it('does not turn missing URLs or unprefixed URLs into an SPA success', async () => {
  expect((await fetch(url + '/components/button/')).status).toBe(404);
  const res = await fetch(url + '/TA-design-system/missing/');
  expect(res.status).toBe(404);
  expect(await res.text()).toBe('not found');
  expect((await fetch(url + '/TA-design-system/%2e%2e%2fsecret')).status).toBe(400);
});
