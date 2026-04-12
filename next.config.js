/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "standalone",
  reactStrictMode: true,
  reactCompiler: true,
  typedRoutes: true,
  experimental: {
    typedEnv: true,
  },

  // pg and Neon are Node.js-only — never bundle them for the browser
  serverExternalPackages: ["pg", "pg-native", "pg-pool", "pg-connection-string"],

  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
