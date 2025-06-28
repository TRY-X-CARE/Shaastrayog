import connectDB from "../database/mongodb";
import { Payment, IPayment } from "../database/model/payment";
import crypto from "crypto";

export class PaymentService {
  // Save payment
  static async savePayment(data: {
    orderId: string;
    amount: number | string; // Amount in paise
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
  }): Promise<IPayment> {
    await connectDB();

    const payment = new Payment({
      orderId: data.orderId,
      amount: data.amount,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      status: "pending",
    });

    const result = await payment.save();
    return result;
  }

  // Update payment status
  static async updatePaymentStatus(
    orderId: string,
    paymentId: string,
    status: string
  ): Promise<IPayment | null> {
    await connectDB();

    const result = await Payment.findOneAndUpdate(
      { orderId: orderId },
      {
        paymentId: paymentId,
        status: status,
      },
      { new: true } // Return updated document
    );

    return result;
  }

  // Get payment by order ID
  static async getPaymentByOrderId(orderId: string): Promise<IPayment | null> {
    await connectDB();
    const payment = await Payment.findOne({ orderId: orderId });
    return payment;
  }

  // Get payment by transaction ID
  static async getPaymentByTransactionId(
    transactionId: string
  ): Promise<IPayment | null> {
    await connectDB();
    const payment = await Payment.findOne({ transactionId: transactionId });
    return payment;
  }

  // Verify payment signature
  static verifyPayment( 
    orderId: string,
    paymentId: string,
    signature: string,
    secret: string
  ): boolean {
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  }
}
