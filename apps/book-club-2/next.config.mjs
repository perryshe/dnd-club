/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  basePath: "/b22",
  transpilePackages: ["club-nav"],
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
}

export default nextConfig
