"use client";

import algoliasearch from "algoliasearch/lite";
import ProductCard from "@/components/ProductCard";
import { ProductProps } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "";
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || "";

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
const index = client.initIndex("dev_safetydocs");

export default function Home() {
  const fetchProducts = async () => {
    try {
      const searchResponse = await index.search<ProductProps>("", {
        hitsPerPage: 100,
        page: 2,
        filters: "",
      });

      return searchResponse.hits || [];
    } catch (error) {
      console.error("Algolia search error:", error);
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
        <ProductCard key={product.objectID || product.id} product={product} />
      ))}
    </div>
  );
}
