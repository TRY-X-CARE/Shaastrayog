import { NextRequest, NextResponse } from "next/server";
import { sendOrderConfirmationMail } from "@/lib/mail";
import { generateInvoiceHtml } from "@/lib/invoice";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Example: Extract relevant info from webhook payload
    // Adjust these keys based on NimbusPost's actual webhook structure
    const orderId = data.order_id || data.orderNumber || "";
    const trackingNumber = data.awb_number || data.tracking_number || "";
    const email = data.customer_email || data.email || "";
    const customerName = data.customer_name || "Customer";
    // Try to get items and total from payload, else use dummy data
    type Item = { name: string; quantity: number; price: number };
    const items: Item[] = data.items || [
      { name: "Product", quantity: 1, price: 0 }
    ];
    const total = data.total || items.reduce((sum: number, item: Item) => sum + (item.price * item.quantity), 0);
    const date = new Date().toLocaleDateString();
    const shippingAddress = data.shipping_address || data.customer_address || "";
    const paymentMethod = data.payment_method || data.paymentMode || "";

    // Only send email if all required info is present
    if (orderId && trackingNumber && email) {
      const invoiceHtml = generateInvoiceHtml({
        orderId,
        customerName,
        items,
        total,
        date,
        shippingAddress,
        paymentMethod,
      });
      await sendOrderConfirmationMail({
        email,
        orderId,
        trackingNumber,
        invoiceHtml
      });
      console.log(`Order confirmation email sent to ${email}`);
    } else {
      console.warn("Missing orderId, trackingNumber, or email in webhook payload");
    }

    // Respond with 200 OK
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid webhook data" }, { status: 400 });
  }
} 