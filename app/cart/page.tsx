"use client";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCart } from "@/components/cart/cart-provider";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { trackInitiateCheckout } from "@/lib/facebook-pixel";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCart();
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const router = useRouter();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleApplyCoupon = () => {
    setIsApplyingCoupon(true);
    // Simulate API call
    setTimeout(() => {
      setIsApplyingCoupon(false);
      setCouponCode("");
      // Show error message (no coupons are valid in this demo)
      alert("Invalid coupon code. Please try again.");
    }, 1000);
  };

  const handleCheckout = () => {
    // Track Initiate Checkout event for Facebook Pixel
    if (items && items.length > 0) {
      trackInitiateCheckout(items, finalTotal);
    }
    
    router.push("/checkout");
  };

  // Shipping calculation (free over ₹999)
  const shippingCost = totalPrice >= 999 ? 0 : 100;
  const finalTotal = totalPrice + shippingCost;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Looks like you haven&apos;t added any products to your cart yet.
        </p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-[#faf6f1] rounded-lg p-8">
        <div className="lg:col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Product</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="w-20 h-20 rounded  overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    ₹
                    {Math.floor(
                      1 * item.price * (1 - item.discountPercentage / 100)
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center border-none rounded-md w-28">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </Button>
                      <span className="flex-1 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between gap-4 sm:flex-row flex-col items-center mt-8">
            <Button asChild>
              <Link href="/shop" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>

            <Button onClick={clearCart}>Clear Cart</Button>
          </div>
        </div>

        <div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
              </div>
              {shippingCost > 0 && (
                <div className="text-sm text-gray-500">
                  Free shipping on orders over ₹999
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between mb-6">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">₹{finalTotal}</span>
            </div>

            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Coupon code"
                  value={couponCode}
                  type="text"
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="border border-none rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={!couponCode || isApplyingCoupon}
                  className="p-2"
                >
                  Apply
                </button>
              </div>

              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
