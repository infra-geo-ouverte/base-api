import { SES, SendRawEmailCommand } from '@aws-sdk/client-ses';
import nodemailer from 'nodemailer';

import { Config } from '../configurations';

export interface Mail {
  to?: string;
  subject: string;
  text: string;
  attachments?: {
    filename: string;
    content: string;
  }[];
}

export async function sendMail(mail: Mail) {
  const mailConfig = Config.getMailConfig();
  if (!mailConfig) {
    console.error('Mail config is not defined');
    return;
  }

  let transporterOpt = {};
  if (mailConfig.aws) {
    transporterOpt = {
      SES: {
        ses: new SES({
          region: mailConfig.region || 'ca-central-1'
        }),
        aws: { SendRawEmailCommand }
      }
    };
  } else {
    transporterOpt = {
      host: mailConfig.host,
      port: mailConfig.port,
      secure: false
    };
  }

  const transporter = nodemailer.createTransport(transporterOpt);

  const mailTo = mail.to || mailConfig.to;
  const mailOptions = {
    from: mailConfig.from,
    to: mailTo,
    subject: mail.subject,
    text: mail.text,
    attachments: mail.attachments
  };

  const info = await transporter
    .sendMail(mailOptions)
    .catch((e) => console.error(e));

  console.log('Email sent: ' + mailTo);

  return info;
}
