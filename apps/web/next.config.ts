import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: [
    "@umbral/persistence",
    "@umbral/contracts",
    "@umbral/orchestrator",
    "@umbral/graph",
  ],
  serverExternalPackages: ["better-sqlite3", "sqlite-vec", "node-pty", "neo4j-driver"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        "better-sqlite3",
        "sqlite-vec",
        "node-pty",
        "neo4j-driver",
      ];
    }
    return config;
  },
};

export default nextConfig;
