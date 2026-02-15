import { getEnv } from "./get-env";

const appConfig = () => ({
  PORT: getEnv("PORT", "5000"),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  BASE_PATH: getEnv("BASE_PATH", "/api/v1"),
  DATABASE_URL: getEnv("DATABASE_URL", ""),
  BETTER_AUTH_SECRET: getEnv("BETTER_AUTH_SECRET", "-base64 32"),
  BETTER_AUTH_URL: getEnv("BETTER_AUTH_URL", "http://localhost:3000"),
  MAILER_SMTP_HOST: getEnv("MAILER_SMTP_HOST", "smtp.example.com"),
  MAILER_SMTP_PORT: getEnv("MAILER_SMTP_PORT", 587),
  MAILER_SMTP_USER: getEnv("MAILER_SMTP_USER"),
  MAILER_SMTP_PASSWORD: getEnv("MAILER_SMTP_PASSWORD"),
  MAILER_SMTP_SENDER: getEnv("MAILER_SMTP_SENDER"),
  CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET"),
  R2_ACCESS_KEY_ID: getEnv("R2_ACCESS_KEY_ID"),
  R2_SECRET_ACCESS_KEY: getEnv("R2_SECRET_ACCESS_KEY"),
  R2_ENDPOINT: getEnv("R2_ENDPOINT"),
  R2_BUCKET_NAME: getEnv("R2_BUCKET_NAME"),
  R2_PUBLIC_URL: getEnv("R2_PUBLIC_URL"),
  MIDTRANS_SERVER_KEY: getEnv(
    "MIDTRANS_SERVER_KEY",
    "SB-Mid-server-xxxxxxxxxxxx",
  ),
  MIDTRANS_CLIENT_KEY: getEnv(
    "MIDTRANS_CLIENT_KEY",
    "SB-Mid-client-xxxxxxxxxxxx",
  ),
  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID", ""),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET", ""),
  MIDTRANS_IS_PRODUCTION: getEnv("MIDTRANS_IS_PRODUCTION", false),
  EXCHANGE_RATE: {
    USD: 16000,
  },
});

export const config = appConfig();
