/** @type {import('next').NextConfig} */

const requiredEnvVars = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "AUTH_URL",
  "NEXT_PUBLIC_APP_URL",
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const nextConfig = {
  transpilePackages: ["@vixi/ui", "@vixi/auth", "@vixi/db"],
  env: {
    NEXT_PUBLIC_GOOGLE_ENABLED: Boolean(
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ),
  },
};

module.exports = nextConfig;
