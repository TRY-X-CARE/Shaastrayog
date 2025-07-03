import { NextRequest, NextResponse } from "next/server";
import type { ShipmentRequest } from "../types";

export async function POST(request: NextRequest) {
  try {
    const API_KEY = process.env.NIMBUS_API_KEY || process.env.NEXT_PUBLIC_NIMBUS_API_KEY;
    if (!API_KEY) {
      console.error("Missing Nimbus API Key");
      return NextResponse.json({ success: false, message: "Missing Nimbus API Key" }, { status: 500 });
    }
    const shipmentData = await request.json();
    console.log("Shipment data received:", shipmentData);

    const response = await fetch("https://api.nimbuspost.com/v1/shipments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${API_KEY}`,
      },
      body: JSON.stringify(shipmentData),
    });

    const data = await response.json();
    console.log("Nimbus API response:", data);

    if (!response.ok) {
      // Log and return the error from Nimbus
      return NextResponse.json({ success: false, message: data.message || "Nimbus API error", data }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Shipment created", data });
  } catch (error) {
    console.error("Error creating shipment:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
} 