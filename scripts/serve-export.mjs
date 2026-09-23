import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateBasePath } from '../src/lib/site-path.mjs';
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.txt': 'text/plain', '.md': 'text/plain; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
/** Serve exactly an export, with no SPA fallback. @param {string} directory @param {string} basePath */
export function createStaticServer(directory, basePath = '') {
  const root = resolve(directory);
  validateBasePath(basePath);
  return createServer(async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return; }
    let path;
    try {
      path = decodeURIComponent((req.url ?? '/').split('?')[0]);
      if (path.includes('\0') || path.includes('\\') || path.split('/').includes('..')) throw new Error('Invalid path');
    } catch { res.writeHead(400); res.end('Invalid path'); return; }
    const notFound = async () => { res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); const body = await readFile(resolve(root, '404.html')).catch(() => Buffer.from('Not found')); res.end(req.method === 'HEAD' ? undefined : body); };
    if (basePath && path !== basePath && !path.startsWith(basePath + '/')) { await notFound(); return; }
    path = path.slice(basePath.length) || '/';
    let file = resolve(root, '.' + path);
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(400); res.end(); return; }
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch { await notFound(); }
  });
}
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const port = Number(process.env.PORT ?? 3000);
  const base = validateBasePath(process.env.SITE_BASE_PATH ?? '');
  createStaticServer('out', base).listen(port, '127.0.0.1', () => console.log(`Export: http://127.0.0.1:${port}${base}/`));
}
