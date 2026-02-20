import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  allowedDevOrigins: [
    "localhost",
    "172.16.0.2",
  ]
};

export default nextConfig;
