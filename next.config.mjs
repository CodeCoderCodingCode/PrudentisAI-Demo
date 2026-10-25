/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{source: "/favicon.png", destination: "/favicon.ico", permanent: true}];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
