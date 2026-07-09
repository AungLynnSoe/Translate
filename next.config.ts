import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/generate": ["./node_modules/kuromoji/dict/**/*"],
  },
};

export default nextConfig;
