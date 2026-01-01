import dotenv from "dotenv"

dotenv.config()

function getEnv(env_name:string): string {
    const value = process.env[env_name]

    if (!value) {
        throw new Error(`❌ Environment variable ${env_name} is missing`)
    }

    return value
}

export const config = {
    PORT: getEnv("PORT"),
    DATABASE_URL: getEnv("DB_CONNECTION_STRING")
}