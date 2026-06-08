/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  basePath: "/b21",
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
