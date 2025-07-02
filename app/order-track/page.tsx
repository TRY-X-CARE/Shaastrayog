import NimbusOrderTrackWidget from "@/components/NimbusOrderTrackWidget";

export default function OrderTrackPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Track Your Order</h1>
      <NimbusOrderTrackWidget />
    </div>
  );
} 