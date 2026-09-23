/** Validate the build-time deployment prefix. @param {string} value */
export function validateBasePath(value) {
  if (value !== '' && !/^\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(value)) {
    throw new Error('SITE_BASE_PATH must be empty or slash-prefixed path segments without a trailing slash.');
  }
  return value;
}
/** Public files/fetch URLs only. Next Link adds basePath itself. @param {string} path @param {string} basePath */
export function publicPath(path, basePath) {
  validateBasePath(basePath);
  if (!path.startsWith('/') || path.startsWith('//') || path.split('/').includes('..')) throw new Error('Expected a local absolute path.');
  if (basePath && (path === basePath || path.startsWith(basePath + '/'))) return path;
  return basePath + path;
}
