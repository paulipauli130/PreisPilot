import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the dev server's generated assets separate from production builds.
  distDir: process.env.NODE_ENV === "development" ? ".next-development" : ".next",
};

export default nextConfig;
