"use client";

import algoliasearch from "algoliasearch/lite";
import ProductCard from "@/components/ProductCard";
import { ProductProps } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;

if (!ALGOLIA_APP_ID || !ALGOLIA_SEARCH_KEY) {
  throw new Error("❌ Algolia credentials are missing in .env file");
}

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
const index = client.initIndex("dev_safetydocs");

export default function Home() {
  const fetchProducts = async (): Promise<ProductProps[]> => {
    try {
      const searchResponse = await index.search<ProductProps>("", {
        hitsPerPage: 15,
        page: 0,
      });

      return searchResponse.hits || [];
    } catch (error) {
      console.error("❌ Algolia search error:", error);
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
    refetchOnWindowFocus: false,
  });
  console.log("[Home Page] Fetched products:", products);

  if (isLoading) {
    return (
      <Loader width={40} height={40} className="animate-spin mx-auto mt-10" />
    );
  }

  if (error instanceof Error) {
    return (
      <div className="m-6 text-red-500">
        Error loading products: {error.message}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="m-6 text-gray-500 text-center">No products found.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 max-w-[1920px] m-8 lg:m-auto mt-5">
      {products.map((product) => (
        <div key={product.key}>
          <ProductCard key={product.key} product={product} />
        </div>
      ))}
    </div>
  );
}
