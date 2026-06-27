/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  basePath: "/g21",
  transpilePackages: ["club-nav"],
  eslint: { ignoreDuringBuilds: true },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
}

export default nextConfig
