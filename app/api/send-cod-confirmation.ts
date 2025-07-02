import { NextRequest, NextResponse } from "next/server";
import { sendOrderConfirmationMail } from "@/lib/mail";
import { generateInvoiceHtml } from "@/lib/invoice";

export async function POST(request: NextRequest) {
  const { email, orderId, customerName, items, total, paymentMethod } = await request.json();
  const invoiceHtml = generateInvoiceHtml({
    orderId,
    customerName,
    items,
    total,
    date: new Date().toLocaleDateString(),
    paymentMethod,
  });
  await sendOrderConfirmationMail({
    email,
    orderId,
    trackingNumber: "", // No tracking yet
    invoiceHtml,
  });
  return NextResponse.json({ success: true });
} 