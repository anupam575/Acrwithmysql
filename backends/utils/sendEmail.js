import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  const msg = {
    to,
    from: {
      email: process.env.SENDGRID_SENDER_EMAIL,
      name: process.env.SENDGRID_SENDER_NAME,
    },
    replyTo: process.env.SENDGRID_REPLY_TO,
    subject,
    text,
    html: html || `<p>${text}</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.response?.body || error.message);
    throw new Error('Failed to send email');
  }
};

export default sendEmail; // ✅ default export