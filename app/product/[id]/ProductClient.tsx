"use client";

import { useState, useEffect } from "react";
import {
  Minus,
  Plus,
  ArrowLeft,
  Truck,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { allProducts } from "@/lib/data";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/product/product-card";
import { trackViewContent } from "@/lib/facebook-pixel";
import Image from "next/image";

// Define the product type based on usage in the component
interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  discountPercentage?: number;
  shortDescription: string;
  fullDescription: string;
  availableUnits: number;
  images: string[];
  category: string;
}

export default function ProductClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const { addItem } = useCart();

  // Track ViewContent event when component mounts
  useEffect(() => {
    trackViewContent({
      id: product.id,
      name: product.name,
      price: product.price,
      discountPercentage: product.discountPercentage,
      quantity: 1,
      image: product.images[0],
      category: product.category,
    });
  }, [product]);

  const incrementQuantity = () => {
    if (quantity < product.availableUnits) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      discountPercentage: product.discountPercentage ?? 0,
      quantity: quantity,
      availableUnits: product.availableUnits,
      image: product.images[0],
    });
  };

  // Get related products from the same category
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Calculate sale price if there's a discount
  const salePrice = product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(0)
    : null;

  return (
    <div className="container mx-auto px-4 py-24 ">
      <div className="mb-6">
        <Button variant="ghost" asChild className="p-0 hover:bg-transparent">
          <Link
            href="/shop"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 ">
        {/* Product Images */}
        <div>
          <div className="mb-4 aspect-square rounded-lg overflow-x bg-gray-100">
            <Image
              src={product.images[currentImage]}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex overflow-x-auto gap-2 scrollbar-thin scrollbar-thumb-gray-300">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`min-w-[100px] min-h-[100px] aspect-square rounded cursor-pointer border-2 ${
                  index === currentImage
                    ? "border-primary"
                    : "border-transparent"
                }`}
                onClick={() => setCurrentImage(index)}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-[#faf6f1] rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < Math.floor(product.rating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-gray-600">
              ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="mb-6">
            {salePrice ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold mr-2">₹{salePrice}</span>
                <span className="text-gray-500 line-through">
                  ₹{product.price}
                </span>
                <span className="ml-2 bg-red-100 text-red-800 text-sm px-2 py-1 rounded">
                  {product.discountPercentage}% OFF
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold">₹{product.price}</span>
            )}
          </div>

          <p className="text-gray-700 mb-6">{product.shortDescription}</p>

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <span className="text-gray-600 block mb-1">Quantity</span>
                <div className="flex items-center border-none rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.availableUnits}
                    className="h-10 w-10 rounded-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-gray-600">
                <span className="block mb-1">Availability</span>
                {product.availableUnits > 10 ? (
                  <span className="text-green-600">In Stock</span>
                ) : product.availableUnits > 0 ? (
                  <span className="text-amber-600">
                    Low Stock ({product.availableUnits} remaining)
                  </span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </div>
            </div>

            <Button
              className="w-full mb-2"
              size="lg"
              onClick={handleAddToCart}
              disabled={product.availableUnits === 0}
            >
              Add to Cart
            </Button>

            <Button onClick={handleAddToCart} className="w-full" size="lg">
              Buy Now
            </Button>
          </div>

          {/* Product Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start">
              <Truck className="h-5 w-5 mr-2 text-gray-600 mt-0.5" />
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-sm text-gray-500">On orders over ₹999</p>
              </div>
            </div>

            <div className="flex items-start">
              <ShieldCheck className="h-5 w-5 mr-2 text-gray-600 mt-0.5" />
              <div>
                <p className="font-medium">1 Year Warranty</p>
                <p className="text-sm text-gray-500">
                  Premium quality guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16 bg-[#faf6f1] rounded-lg p-4 ">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b gap-4 rounded-none ">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <div className="py-6">
              <p className="whitespace-pre-line">{product.fullDescription}</p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Features</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Premium quality materials</li>
                  <li>Eco-friendly and sustainable</li>
                  <li>Designed for optimal performance</li>
                  <li>Durable and long-lasting</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping">
            <div className="py-6">
              <h3 className="text-lg font-semibold mb-2">
                Shipping Information
              </h3>
              <p className="mb-4">
                We ship all across India. Standard shipping typically takes 3-5
                business days, while express shipping takes 1-2 business days.
              </p>

              <h3 className="text-lg font-semibold mb-2 mt-6">Return Policy</h3>
              <p>
                We accept returns within 30 days of purchase. The product must
                be unused and in its original packaging. Please note that
                shipping costs are non-refundable.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="py-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <p className="text-gray-600">
                    Based on {product.reviewCount} reviews
                  </p>
                </div>

                <Button>Write a Review</Button>
              </div>

              <div className="space-y-6">
                {/* Mock reviews */}
                <div className="border-b pb-6">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <Image
                        src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1200"
                        alt="User"
                        width={100}
                        height={100}
                        className="w-10 h-10 rounded-full object-cover mr-4"
                        loading="lazy"
                      />
                      <div>
                        <h4 className="font-semibold">Priya M.</h4>
                        <div className="flex text-yellow-400 text-sm">
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-gray-600 text-sm">2 months ago</span>
                  </div>
                  <p>
                    The quality exceeded my expectations. Excellent product and
                    fast shipping!
                  </p>
                </div>

                <div className="border-b pb-6">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <Image
                        src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1200"
                        alt="User"
                        width={100}
                        height={100}
                        className="w-10 h-10 rounded-full object-cover mr-4"
                        loading="lazy"
                      />
                      <div>
                        <h4 className="font-semibold">Rahul S.</h4>
                        <div className="flex text-yellow-400 text-sm">
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span className="text-gray-300">★</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-gray-600 text-sm">1 month ago</span>
                  </div>
                  <p>
                    Great product, but took a bit longer to arrive than
                    expected. Overall satisfied with my purchase.
                  </p>
                </div>
              </div>

              <Button variant="outline" className="mt-4">
                Load More Reviews
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <Separator className="my-16" />

      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Related Products</h2>
          <Button variant="ghost" asChild>
            <Link href="/shop" className="flex items-center">
              View All
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
