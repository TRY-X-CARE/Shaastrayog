"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product/product-card";
import { allProducts } from "@/lib/data";
import { Separator } from "@/components/ui/separator";

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 3000]);

  // Filter products based on search query, categories, and price
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="container mx-auto px-4 py-24 ">
      <div className="flex  justify-center">
        <div className="bg-[#faf6f1] rounded-lg p-6 content-center mb-10 w-[100%] xs:w-[50%]">
          <h1 className="text-3xl font-bold text-center mb-2">
            Shop Our Collection
          </h1>
          <p className="text-center text-gray-600 ">
            Discover premium products for your shaastrayog journey
          </p>
        </div>
      </div>
      {/* Search and Filter Bar */}
      <div className="bg-[#faf6f1] rounded-lg p-6 mb-10">
        <div className="mb-8 ">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute top-1/2 transform -translate-y-1/2 left-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for products..."
                value={searchQuery}
                type="text"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-transparent border-none shadow-none focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Results Count */}
        <div className="mb-2 flex justify-between items-center ">
          <p className="text-gray-600">
            Showing {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "result" : "results"}
          </p>

          {/* Sort Options - can be expanded later */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm">Sort by:</span>
            <select className="text-sm border rounded-md p-1">
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
