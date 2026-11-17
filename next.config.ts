import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  images: {
    formats: ["image/avif", "image/webp"]
  },
  experimental: {
    swcPlugins: [],
  },
  compiler: {
    removeConsole: false,
  },
  // Forzar uso de Babel en lugar de SWC en este entorno Windows
  webpack: (config, { isServer, dev }) => {
    return config;
  },
};

export default nextConfig;
