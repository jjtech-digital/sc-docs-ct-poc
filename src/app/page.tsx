"use client";
import ProductCard from "@/components/ProductCard";
import { ProductProps } from "@/types/ProductProps";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";

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

  if (isLoading) return <Loader width={40} height={40} className="animate-spin" />;
  if (error)
    return <div className="m-6">Error loading products: {error.message}</div>;
  return (
    <div className="m-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {products.map((product: ProductProps) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
