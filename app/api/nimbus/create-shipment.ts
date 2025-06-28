import type { NextApiRequest, NextApiResponse } from "next";
import type { ShipmentRequest, NimbusResponse } from "./types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NimbusResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const API_KEY = process.env.NIMBUS_API_KEY;
  if (!API_KEY) {
    return res
      .status(500)
      .json({ success: false, message: "Missing Nimbus API Key" });
  }

  const shipmentData: ShipmentRequest = req.body;

  try {
    const response = await fetch("https://api.nimbuspost.com/v1/shipments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${API_KEY}`,
      },
      body: JSON.stringify(shipmentData),
    });

    const data = await response.json();
    return res
      .status(200)
      .json({ success: true, message: "Shipment created", data });
  } catch (error) {
    console.error("Error creating shipment:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
