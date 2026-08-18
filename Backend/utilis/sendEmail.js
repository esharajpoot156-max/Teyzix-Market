import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

export const sendOTPEmail = async (toEmail, otp) => {
  console.log("=== SENDING OTP EMAIL ===");
  console.log("To:", toEmail);
  console.log("SMTP User:", process.env.BREVO_SMTP_USER);
  console.log("Sender Email:", process.env.BREVO_SENDER_EMAIL);

  try {
    const info = await transporter.sendMail({
      from: `"TeyzixMarket" <${process.env.BREVO_SENDER_EMAIL}>`,
      to: toEmail,
      subject: "Verify your TeyzixMarket account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
          <h2>Email Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
    console.log("Email sent successfully:", info.messageId, info.response);
  } catch (err) {
    console.error("EMAIL SEND FAILED:", err.message);
    throw err;
  }
};