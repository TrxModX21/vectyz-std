import nodemailer from "nodemailer";
import { config } from "../utils/app.config";

export const transporter = nodemailer.createTransport({
  host: config.MAILER_SMTP_HOST as string,
  port: config.MAILER_SMTP_PORT as number,
  auth: {
    user: config.MAILER_SMTP_USER as string,
    pass: config.MAILER_SMTP_PASSWORD as string,
  },
});
