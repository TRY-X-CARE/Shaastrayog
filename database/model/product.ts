import mongoose, { Document, Schema, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  availableUnits: number;
  reservedUnits: number;
  totalUnits: number;
  category?: string;
  sku?: string;
  imageUrl?: string;
  isActive: boolean;
  soldUnits: number;
  createdAt: Date;
  updatedAt: Date;
  updateQuantities(
    availableUnits: number,
    reservedUnits: number,
    totalUnits: number
  ): Promise<IProduct>;
}

export interface IProductModel extends Model<IProduct> {
  getLowStockProducts(threshold?: number): Promise<IProduct[]>;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    availableUnits: {
      type: Number,
      required: [true, "Available units is required"],
      min: [0, "Available units cannot be negative"],
      default: 0,
    },
    reservedUnits: {
      type: Number,
      required: [true, "Reserved units is required"],
      min: [0, "Reserved units cannot be negative"],
      default: 0,
    },
    totalUnits: {
      type: Number,
      required: [true, "Total units is required"],
      min: [0, "Total units cannot be negative"],
      default: 0,
    },
    category: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      unique: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for sold units
ProductSchema.virtual("soldUnits").get(function () {
  return this.totalUnits - this.availableUnits - this.reservedUnits;
});

// Pre-save middleware to validate units
ProductSchema.pre<IProduct>("save", function (next) {
  if (this.availableUnits + this.reservedUnits > this.totalUnits) {
    const error = new Error(
      "Available units + Reserved units cannot exceed total units"
    );
    return next(error);
  }
  next();
});

// Instance method to update quantities
ProductSchema.methods.updateQuantities = function (
  this: IProduct,
  availableUnits: number,
  reservedUnits: number,
  totalUnits: number
) {
  if (availableUnits + reservedUnits > totalUnits) {
    throw new Error(
      "Available units + Reserved units cannot exceed total units"
    );
  }

  this.availableUnits = availableUnits;
  this.reservedUnits = reservedUnits;
  this.totalUnits = totalUnits;

  return this.save();
};

// Static method to get low stock products

const Product: IProductModel =
  (mongoose.models.Product as IProductModel) ||
  mongoose.model<IProduct, IProductModel>("Product", ProductSchema);

export default Product;
