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
  CLOUDINARY_CLAUDE_NAME: getEnv("CLOUDINARY_CLAUDE_NAME"),
  CLOUDINARY_SECRET: getEnv("CLOUDINARY_SECRET"),
  CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_UPLOAD_FOLDER: getEnv("CLOUDINARY_UPLOAD_FOLDER")
};
