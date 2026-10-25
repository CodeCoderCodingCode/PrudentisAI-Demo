/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { externalDir: true },
  devIndicators: { buildActivity: false },
  // Run ESLint separately with `npm run lint`. Next 15.1's embedded lint
  // integration cannot serialize this repository's ESLint 9 flat parser.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
