import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: "/e21",
  trailingSlash: true,
  transpilePackages: ["club-nav"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
