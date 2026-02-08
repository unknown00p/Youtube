function getEnv(env_name: string): string {
  const value = Bun.env[env_name];

  if (!value) {
    throw new Error(`❌ Environment variable ${env_name} is missing`);
  }

  return value;
}

export const config = {
  PORT: getEnv("PORT"),
  DATABASE_URL: getEnv("DB_CONNECTION_STRING"),
  ACCESS_TOKEN_SECRET: getEnv("ACCESS_TOKEN_SECRET"),
  ACCESS_TOKEN_EXPIRATION: getEnv("ACCESS_TOKEN_EXPIRATION"),
  REFRESH_TOKEN_SECRET: getEnv("REFRESH_TOKEN_SECRET"),
  REFRESH_TOKEN_EXPIRATION: getEnv("REFRESH_TOKEN_EXPIRATION"),
  B2_ACCESS_KEY_ID: getEnv("B2_ACCESS_KEY_ID"),
  B2_SECRET_ACCESS_KEY: getEnv("B2_SECRET_ACCESS_KEY"),
  B2_REGION: getEnv("B2_REGION"),
  B2_ENDPOINT: getEnv("B2_ENDPOINT"),
};