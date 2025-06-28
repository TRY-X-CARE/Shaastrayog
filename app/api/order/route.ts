import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { PaymentService } from "../../../lib/services";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const { amount, customerInfo } = await request.json();

    if (
      !customerInfo.firstName ||
      !customerInfo.email ||
      !customerInfo.phone ||
      !amount
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    // Save to database
    await PaymentService.savePayment({
      orderId: order.id,
      amount: order.amount,
      customerName: customerInfo.firstName,
      customerPhone: customerInfo.phone,
    });

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      name: customerInfo.firstName,
      phone: customerInfo.phone,
      email: customerInfo.email,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
