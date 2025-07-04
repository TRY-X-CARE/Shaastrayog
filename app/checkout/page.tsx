"use client";
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart/cart-provider";
import { useAuth } from "@/components/auth/auth-provider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Lock } from "lucide-react";
import Script from "next/script";
import { trackAddPaymentInfo, trackPurchase } from "@/lib/facebook-pixel";

// Types
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderData {
  amount: number;
  currency: string;
  customerInfo: FormValues;
  items: CartItem[];
  paymentMethod?: string;
  status?: string;
}

interface OrderResult {
  success: boolean;
  id?: string;
  message?: string;
}

interface PaymentVerificationResult {
  success: boolean;
  message?: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  readonly: {
    name: boolean;
    email: boolean;
    contact: boolean;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

// Enhanced form schema with better validation
const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City name must be at least 2 characters"),
  state: z.string().min(2, "State name must be at least 2 characters"),
  postalCode: z
    .string()
    .min(6, "Postal code must be at least 6 digits")
    .regex(/^\d+$/, "Postal code must contain only digits"),
  paymentMethod: z.enum(["razorpay", "cod"], {
    required_error: "Please select a payment method",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// Declare Razorpay global
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export default function CheckoutPage(): JSX.Element {
  const router = useRouter();

  // ALL HOOKS MUST BE CALLED AT THE TOP LEVEL - NEVER CONDITIONALLY
  const { items, totalPrice, clearCart } = useCart();
  const { user, signIn } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      paymentMethod: "razorpay",
    },
  });

  // State hooks - always called
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // All useEffect hooks - always called
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (user?.email) {
      form.setValue("email", user.email);
    }
  }, [user, form]);

  useEffect(() => {
    if (isMounted && items && items.length === 0) {
      router.push("/cart");
    }
  }, [isMounted, items, router]);

  // All useCallback hooks - always called
  const createOrder = useCallback(
    async (orderData: OrderData): Promise<OrderResult> => {
      try {
        const response = await fetch("/api/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();
        return result;
      } catch (error) {
        console.error("Error creating order:", error);
        toast.error("Failed to create order. Please try again later.");
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      }
    },
    []
  );

  const verifyPayment = useCallback(
    async (paymentData: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      email: string;
    }): Promise<PaymentVerificationResult> => {
      try {
        const response = await fetch("/api/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        });

        const result = await response.json();

        return result;
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error("Payment verification failed. Please try again later.");
        throw error instanceof Error
          ? error
          : new Error("Payment verification failed");
      }
    },
    []
  );

  const handlePaymentSuccess = useCallback(
    async (response: RazorpayResponse): Promise<void> => {
      try {
        const formData = form.getValues();
        const verificationResult = await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          email: formData.email,
        });

        if (verificationResult) {
          // Track Purchase event for Facebook Pixel
          if (items && items.length > 0) {
            trackPurchase(
              response.razorpay_order_id,
              items,
              Number(totalPrice),
            );
          }

          toast.success("Payment successful! Your order is being processed.");
          await fetch("/api/nimbus/create-shipment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customer_name: `${formData.firstName} ${formData.lastName}`,
              customer_address: formData.address,
              customer_city: formData.city,
              customer_state: formData.state,
              customer_pincode: formData.postalCode,
              customer_phone: formData.phone,
              order_number: response.razorpay_order_id,
              product_name: (items || []).map(i => i.name).join(", "),
              quantity: (items || []).reduce((sum, i) => sum + i.quantity, 0),
              length: 15,
              breadth: 10,
              height: 10,
              weight: 0.1, // 100 grams in kg
              payment_mode: "Prepaid",
              collectable_amount: 0,
            }),
          });
          clearCart();
          router.push("/order-success");
        } else {
          toast.error("Payment verification failed. Please contact support.");
          setError("Payment verification failed. Please contact support.");
          console.error("Payment verification failed");
        }
      } catch (error) {
        toast.error("Error processing payment. Please try again.");
        setError("Error processing payment. Please try again.");
        console.error("Error handling payment success:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [verifyPayment, clearCart, router, items, totalPrice]
  );

  const initializeRazorpay = useCallback(
    async (orderId: string, amount: number): Promise<void> => {
      try {
        const formData = form.getValues();
        const options: RazorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          amount: amount * 100,
          currency: "INR",
          name: "Shaastra Yog",
          description: "Order Payment",
          order_id: orderId,
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          readonly: {
            name: true,
            email: true,
            contact: true,
          },
          handler: handlePaymentSuccess,
          modal: {
            ondismiss: () => {
              toast.error("Payment cancelled by user");
              setIsProcessing(false);
            },
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } catch (err) {
        toast.error("Failed to initialize payment. Please try again.");
        setError("Failed to initialize payment. Please try again.");
        console.error("Razorpay initialization error:", err);
        setIsProcessing(false);
      }
    },
    [razorpayLoaded, form, handlePaymentSuccess]
  );

  const handleRazorpayPayment = useCallback(async (): Promise<void> => {
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const formData = form.getValues();

      const orderData: OrderData = {
        amount: Number(totalPrice),
        currency: "INR",
        customerInfo: formData,
        items: items || [],
      };

      const orderResult = await createOrder(orderData);

      if (orderResult.id) {
        await initializeRazorpay(orderResult.id, Number(totalPrice));
      } else {
        setError(orderResult.message || "Failed to create order");
        toast.error(
          orderResult.message || "Failed to create order. Please try again."
        );
        setIsProcessing(false);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error processing payment"
      );
      setIsProcessing(false);
    }
  }, [form, totalPrice, items, createOrder, initializeRazorpay]);

  const handleCODPayment = useCallback(
    async (data: FormValues): Promise<void> => {
      setIsProcessing(true);
      setError("");

      try {
        const orderData: OrderData = {
          ...data,
          paymentMethod: "cod",
          amount: Number(totalPrice),
          items: items || [],
          status: "pending",
          customerInfo: data,
          currency: "INR",
        };

        const orderResult = await createOrder(orderData);

        if (orderResult) {
          // Track Purchase event for Facebook Pixel (COD)
          if (items && items.length > 0) {
            trackPurchase(
              orderResult.id || 'cod-order',
              items,
              Number(totalPrice),
            );
          }

          // Call API route to send confirmation email for COD
          await fetch("/api/send-cod-confirmation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: data.email,
              orderId: orderResult.id || 'cod-order',
              customerName: `${data.firstName} ${data.lastName}`,
              items: items || [],
              total: Number(totalPrice),
              paymentMethod: 'Cash on Delivery',
            }),
          });

          await fetch("/api/nimbus/create-shipment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customer_name: `${data.firstName} ${data.lastName}`,
              customer_address: data.address,
              customer_city: data.city,
              customer_state: data.state,
              customer_pincode: data.postalCode,
              customer_phone: data.phone,
              order_number: orderResult.id || 'cod-order',
              product_name: (items || []).map(i => i.name).join(", "),
              quantity: (items || []).reduce((sum, i) => sum + i.quantity, 0),
              length: 15,
              breadth: 10,
              height: 10,
              weight: 0.1, // 100 grams in kg
              payment_mode: "COD",
              collectable_amount: Number(totalPrice),
            }),
          });

          toast.success("Order placed successfully! Please pay on delivery.");
          clearCart();
          router.push("/order-success");
        } else {
          setError(orderResult || "Failed to place order");
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Error processing order"
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [totalPrice, items, createOrder, clearCart, router]
  );

  const onSubmit = useCallback(
    (data: FormValues): void => {
      if (data.paymentMethod === "razorpay") {
        handleRazorpayPayment();
      } else {
        handleCODPayment(data);
      }
    },
    [handleRazorpayPayment, handleCODPayment]
  );

  // Render logic - conditionally render content but hooks are always called
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Button onClick={() => router.push("/cart")}>Go to Cart</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => {
          setRazorpayLoaded(true);
        }}
        onError={() => {
          console.error("Failed to load Razorpay script");
          setError("Failed to load payment gateway");
        }}
      />

      <div className="container mx-auto px-4 py-24 ">
        <div className="bg-[#faf6f1] mb-6 rounded-2xl p-4">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600 mb-8">Complete your order</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 p-4 bg-[#faf6f1] rounded-lg"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Shipping Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Email address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Street address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Track Add Payment Info event when payment method is selected
                              if (items && items.length > 0) {
                                trackAddPaymentInfo(items, Number(totalPrice), value);
                              }
                            }}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="razorpay" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Pay with Razorpay (Credit/Debit Card, UPI,
                                Wallet)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="cod" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Cash on Delivery (COD)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>

                <div className="flex items-center justify-center text-sm text-gray-500">
                  <Lock className="h-4 w-4 mr-2" />
                  Secure Payment Processing
                </div>
              </form>
            </Form>
          </div>

          <div>
            <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-4">
                {items?.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden mr-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{item.name}</p>
                        <p className="text-gray-500 text-sm">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{totalPrice || 0}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">₹{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
