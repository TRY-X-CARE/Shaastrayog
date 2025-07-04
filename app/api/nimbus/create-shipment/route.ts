import { NextRequest, NextResponse } from "next/server";
import type { ShipmentRequest } from "../types";

export async function POST(request: NextRequest) {
  try {
    const API_KEY = process.env.NIMBUS_API_KEY;
    console.error("Missing Nimbus API Key", API_KEY);
    if (!API_KEY) {
      console.error("Missing Nimbus API Key");
      return NextResponse.json(
        { success: false, message: "Missing Nimbus API Key" },
        { status: 500 }
      );
    }
    const shipmentData = await request.json();
    // Split customer name into fname and lname
    const [fname, ...lnameParts] = shipmentData.customer_name.split(" ");
    const lname = lnameParts.join(" ") || "NA";

    const formData = new FormData();
    formData.append("fname", fname);
    formData.append("lname", lname);
    formData.append("address", shipmentData.customer_address);
    formData.append("phone", shipmentData.customer_phone);
    formData.append("city", shipmentData.customer_city);
    formData.append("state", shipmentData.customer_state);
    formData.append("amount", shipmentData.collectable_amount);
    formData.append("country", "India");
    formData.append("pincode", shipmentData.customer_pincode);
    formData.append("payment_method", shipmentData.payment_mode);
    formData.append("order_number", shipmentData.order_number);
    // formData.append("length", String(shipmentData.length));
    // formData.append("breadth", String(shipmentData.breadth));
    // formData.append("height", String(shipmentData.height));
    // formData.append("weight", String(shipmentData.weight));

    // formData.append(
    //   "products",
    //   JSON.stringify([
    //     {
    //       name: shipmentData.product_name,
    //       qty: shipmentData.quantity,
    //       price: shipmentData.collectable_amount,
    //     },
    //   ])
    // );

    formData.append("products[0][name]", shipmentData.product_name);
    formData.append("products[0][qty]", String(shipmentData.quantity));
    formData.append(
      "products[0][price]",
      String(shipmentData.collectable_amount)
    );

    console.log("Products data:", formData);

    const response = await fetch(
      "https://ship.nimbuspost.com/api/orders/create",
      {
        method: "POST",
        headers: {
          "NP-API-KEY": API_KEY,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!data.status) {
      console.error("Nimbus API error:", data.message);
      return NextResponse.json(
        { success: false, message: data.message || "Nimbus API error" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Shipment created",
      data,
    });
  } catch (error) {
    console.error("Error creating shipment:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
