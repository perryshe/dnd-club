/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  basePath: "/b21",
  transpilePackages: ["club-nav"],
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
