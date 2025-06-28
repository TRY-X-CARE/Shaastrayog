import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Type definitions
interface MailContent {
  email: string;
  subject: string;
  htmlContent: string;
}

interface PaymentDetails {
  transactionId: string;
  email: string;
}

// Transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email function
const sendEmail = async ({
  email,
  subject,
  htmlContent,
}: MailContent): Promise<void> => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}`);
  } catch (error: any) {
    console.error("EmailSendError:", error.message || error);
    throw new Error("Failed to send email");
  }
};

// Send payment confirmation mail
export const sendPaymentMail = async ({
  transactionId,
  email
}: PaymentDetails): Promise<void> => {
  if (!transactionId) {
    throw new Error(
      "Missing required fields to send payment confirmation email."
    );
  }

  const subject = "Payment Confirmation - ShaastraYog";
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.5;">
      <p>Dear,</p>
      <p>We have successfully received your payment.</p>
      <h2 style="color: #28a745;">Payment Confirmed</h2>
      <p><strong>Transaction ID:</strong> ${transactionId}</p>
      <br>
      <p>Thank you for your purchase! If you have any questions or need support, feel free to reach out to us.</p>
      <br>
      <p>Warm regards,</p>
      <p><strong>Team ShaastraYog</strong></p>
    </div>
  `;

  await sendEmail({ email, subject, htmlContent });
};
