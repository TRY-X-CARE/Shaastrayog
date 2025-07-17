"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { Product } from "@/lib/types";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      discountPercentage: product.discountPercentage,
      quantity: 1,
      availableUnits: product.availableUnits,
      image: product.images[0],
    });
  };

  return (
    <div
      className="group bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {product.discountPercentage > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold py-1 px-2 rounded">
              {product.discountPercentage}% OFF
            </div>
          )}

          <div
            className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : ""
            }`}
          >
            <Button
              variant="secondary"
              className="bg-white text-gray-800 hover:bg-gray-100"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mb-2 line-clamp-2">
            {product.shortDescription}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {product.discountPercentage > 0 ? (
                <>
                  <span className="text-lg font-bold">
                    ₹
                    {(
                      product.price *
                      (1 - product.discountPercentage / 100)
                    ).toFixed(0)}
                  </span>
                  <span className="text-gray-400 line-through ml-2 text-sm">
                    ₹{product.price}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold">₹{product.price}</span>
              )}
            </div>

            <div className="flex text-yellow-400 text-sm">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span className="text-gray-300">★</span>
              <span className="text-gray-600 ml-1">
                ({product.reviewCount})
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
