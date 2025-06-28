import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Product, { IProduct } from "../../../database/model/product";

// MongoDB connection
const connectDB = async (): Promise<void> => {
  if (mongoose.connections[0].readyState) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to database");
  }
};

// GET - Fetch all products
export async function GET(): Promise<NextResponse> {
  try {
    await connectDB();

    const products = await Product.find({ isActive: true }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body = await request.json();
    const {
      name,
      description,
      price,
      availableUnits,
      reservedUnits,
      totalUnits,
      category,
      sku,
      imageUrl,
    }: Partial<IProduct> = body;

    // Validation
    if (!name || !price || totalUnits === undefined) {
      return NextResponse.json(
        { success: false, error: "Name, price, and total units are required" },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    if (sku) {
      const existingProduct = await Product.findOne({ sku, isActive: true });
      if (existingProduct) {
        return NextResponse.json(
          { success: false, error: "Product with this SKU already exists" },
          { status: 400 }
        );
      }
    }

    const product = new Product({
      name,
      description,
      price,
      availableUnits: availableUnits || 0,
      reservedUnits: reservedUnits || 0,
      totalUnits,
      category,
      sku,
      imageUrl,
    });

    const savedProduct = await product.save();

    return NextResponse.json(
      {
        success: true,
        data: savedProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
