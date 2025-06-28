// models/Payment.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  orderId: string;
  paymentId?: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String },
    amount: { type: Number, required: true }, // in paise
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);

export const Payment =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
