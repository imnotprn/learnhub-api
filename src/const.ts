const { JWT_SECRET: ENV_JWT_SECRET } = process.env;

if (!ENV_JWT_SECRET)
  throw new Error("Environment variable: JWT_SECRET is not configured");

export const JWT_SECRET = ENV_JWT_SECRET;
