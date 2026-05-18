import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import AppError from "../errorHelpers/AppError";
import { envVar } from "../config/env.config";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: envVar.SMTP_HOST,
  port: Number(envVar.SMTP_PORT),
  secure: true,
  auth: {
    user: envVar.SMTP_USER,
    pass: envVar.SMTP_PASS,
  },
});

interface ISendmailOption {
  to: string;
  subject: string;
  attachments?: { fileName: string; content: Buffer | string; contentType: string }[];
  templateName: string;
  templateData: Record<string, any>;
}

export const sendEMail = async ({ to, subject, attachments, templateName, templateData }: ISendmailOption) => {
  try {
    const templatePath = await path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: `"Gizmo Craft" <no-reply@gizmocraft.com>`,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.fileName,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
    console.log(`Email set to ${to}: ${info.messageId}`);
  } catch (error: any) {
    console.log(error.message);
    throw new AppError(400, "Email Send Error");
  }
};
