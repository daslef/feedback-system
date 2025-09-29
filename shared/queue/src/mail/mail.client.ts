import nodemailer from "nodemailer";
import { env, type Env } from "../env";

interface ClientProps {
  env: Env;
}

async function createMailClient({ env }: ClientProps) {
  try {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
      tls: {
        minVersion: "TLSv1",
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export const mailClient = await createMailClient({ env });

mailClient?.verify((error) => {
  if (error) {
    console.error("SMTP configuration error:", error);
  }
});
