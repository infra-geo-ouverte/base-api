import * as nodemailer from 'nodemailer';
import { Config } from '../configurations';

export interface Mail {
  to?: string;
  subject: string;
  text: string;
}

export async function sendMail(mail: Mail) {
  const mailConfig = Config.getMailConfig();
  if (!mailConfig) {
    console.error('Mail config is not defined');
    return;
  }
  const transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: false
  });

  const mailOptions = {
    from: mailConfig.from,
    to: mail.to || mailConfig.to,
    subject: mail.subject,
    text: mail.text
  };

  const info = await transporter
    .sendMail(mailOptions)
    .catch(e => console.error(e));

  console.log('Email sent: ' + info.response);

  return info;
}
