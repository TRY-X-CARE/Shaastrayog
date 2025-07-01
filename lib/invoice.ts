export function generateInvoiceHtml({
  orderId,
  customerName,
  items,
  total,
  date,
  shippingAddress,
  paymentMethod,
}: {
  orderId: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  date: string;
  shippingAddress?: string;
  paymentMethod?: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; border:1px solid #eee; padding:20px;">
      <h2>Invoice</h2>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Customer:</strong> ${customerName}</p>
      ${shippingAddress ? `<p><strong>Shipping Address:</strong> ${shippingAddress}</p>` : ""}
      ${paymentMethod ? `<p><strong>Payment Method:</strong> ${paymentMethod}</p>` : ""}
      <table style="width:100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border-bottom:1px solid #ccc; text-align:left;">Item</th>
            <th style="border-bottom:1px solid #ccc; text-align:right;">Qty</th>
            <th style="border-bottom:1px solid #ccc; text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td style="text-align:right;">${item.quantity}</td>
              <td style="text-align:right;">₹${item.price}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <h3 style="text-align:right; margin-top:20px;">Total: ₹${total}</h3>
    </div>
  `;
} 