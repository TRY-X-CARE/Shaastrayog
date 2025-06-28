import { notFound } from "next/navigation";
import { featuredProducts } from "@/lib/data";
import ProductClient from "./ProductClient";

// This function is required for static exports with dynamic routes
export function generateStaticParams() {
  // Return an array of objects with the 'id' parameter for each product
  return featuredProducts.map((product) => ({
    id: product.id,
  }));
}

// Server component that passes data to the client component
export default function ProductPage({ params }: { params: { id: string } }) {
  const product = featuredProducts.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}
