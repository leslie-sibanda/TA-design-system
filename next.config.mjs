import { createMDX } from 'fumadocs-mdx/next';
import { validateBasePath } from './src/lib/site-path.mjs';
const basePath = validateBasePath(process.env.SITE_BASE_PATH ?? '');

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_SITE_BASE_PATH: basePath },
  reactStrictMode: true,
};

export default withMDX(config);
