import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@umbral/persistence", "@umbral/contracts", "@umbral/orchestrator"],
  serverExternalPackages: ["better-sqlite3", "sqlite-vec", "node-pty"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        "better-sqlite3",
        "sqlite-vec",
        "node-pty",
      ];
    }
    return config;
  },
};

export default nextConfig;
