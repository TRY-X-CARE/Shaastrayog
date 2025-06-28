export interface Product {
  id: string;
  name: string;
  price: number;
  discountPercentage: number;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  category: string;
  tags: string[];
  reviewCount: number;
  rating: number;
  availableUnits: number;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  shippingAddress: Address;
  paymentInfo: PaymentInfo;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Address {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface PaymentInfo {
  method: "razorpay" | "cod";
  status: "pending" | "successful" | "failed";
  transactionId?: string;
}
