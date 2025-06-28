import { NextResponse } from "next/server";
import { PaymentService } from "../../../lib/services";
import { sendPaymentMail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
    } = await request.json();

    // Verify payment
    const isValid = PaymentService.verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Update payment status
    await PaymentService.updatePaymentStatus(
      razorpay_order_id,
      razorpay_payment_id,
      "completed"
    );

    sendPaymentMail({
      transactionId: razorpay_payment_id,
      email,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
