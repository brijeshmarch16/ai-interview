/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  typedRoutes: true,
  experimental: {
    typedEnv: true,
  },

  // pg is Node.js-only — never bundle it for the browser
  serverExternalPackages: ["pg", "pg-native", "pg-pool", "pg-connection-string"],

  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
