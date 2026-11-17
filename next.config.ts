import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  images: {
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
