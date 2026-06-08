/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  basePath: "/b21",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
