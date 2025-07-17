"use client";
import ProductCard from "@/components/ProductCard";
import { ProductProps } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";

export default function Home() {
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?limit=6&offset=12", {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en-US",
        },
      });

      const response = await res.json();

      if (!res.ok) {
        console.warn("API error:", response.message || "Unknown error");
        return [];
      }

      return response?.products || [];
    } catch (error) {
      console.error("Network/API error:", error);
      return [];
    }
  };

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading)
    return <Loader width={40} height={40} className="animate-spin" />;

  if (error instanceof Error)
    return <div className="m-6">Error loading products: {error.message}</div>;

  if (products.length === 0) {
    return (
      <div className="m-6 text-gray-500 text-center">No products found.</div>
    );
  }

  return (
    <div className="m-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {products.map((product: ProductProps) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
