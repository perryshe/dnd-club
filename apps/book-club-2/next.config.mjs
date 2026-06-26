/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  basePath: "/b22",
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
}

export default nextConfig
