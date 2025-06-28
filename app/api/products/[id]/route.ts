import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Product, { IProduct } from '../../../../database/model/product';

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

// GET - Fetch single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID" },
        { status: 400 }
      );
    }

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

    // Validation for quantities
    if (
      availableUnits !== undefined &&
      reservedUnits !== undefined &&
      totalUnits !== undefined
    ) {
      if (availableUnits + reservedUnits > totalUnits) {
        return NextResponse.json(
          {
            success: false,
            error: "Available units + Reserved units cannot exceed total units",
          },
          { status: 400 }
        );
      }
    }

    // Check if SKU already exists (if updating SKU)
    if (sku) {
      const existingProduct = await Product.findOne({
        sku,
        _id: { $ne: id },
        isActive: true,
      });
      if (existingProduct) {
        return NextResponse.json(
          { success: false, error: "Product with this SKU already exists" },
          { status: 400 }
        );
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(availableUnits !== undefined && { availableUnits }),
        ...(reservedUnits !== undefined && { reservedUnits }),
        ...(totalUnits !== undefined && { totalUnits }),
        ...(category !== undefined && { category }),
        ...(sku !== undefined && { sku }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
