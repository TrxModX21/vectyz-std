import { config } from "../utils/app.config";
import { transporter } from "./mailClient";

type Params = {
  from?: string;
  to: string | string[];
  subject: string;
  text: string;
  html: string;
};

const mailer_sender =
  config.NODE_ENV === "development"
    ? `no-reply <trxcode21@gmail.com>`
    : `no-reply <${config.MAILER_SMTP_SENDER}>`;

export const sendEmail = async ({
  from = mailer_sender,
  to,
  subject,
  text,
  html,
}: Params) =>
  await transporter.sendMail({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    text,
    html,
  });
