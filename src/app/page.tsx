"use client";
import ProductCard from "@/components/ProductCard";
import { ProductProps } from "@/types/ProductProps";
import { useQuery } from "@tanstack/react-query";
export default function Home() {
  const fetchProducts = async () => {
    const res = await fetch("/api/products?limit=6&offset=12", {
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en-US",
      },
    });
    const response = await res.json();
    return response?.products;
  };

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) return <div className="m-6">Loading products...</div>;
  if (error)
    return <div className="m-6">Error loading products: {error.message}</div>;
  return (
    <div className="m-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product: ProductProps) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
