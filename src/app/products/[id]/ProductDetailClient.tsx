"use client";
import { useCart } from "@/context/CartContext";
import { ProductProps } from "@/types/ProductProps";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Loader from "@/components/Loader";

const fetchProduct = async (id: string) => {
  const res = await fetch(`/api/products/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "en-US",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
};

const ProductDetailClient = ({ id }: { id: string }) => {
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<ProductProps>({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  });

  const { addToCart } = useCart();

  if (isLoading) {
    return <Loader width={40} height={40} className="animate-spin" />;
  }

  if (error || !product) {
    return <div>Error loading product</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {product?.masterVariant?.images?.[0]?.url && (
          <div className="w-full h-full aspect-square md:aspect-auto relative mr-5">
            <Image
              src={product?.masterVariant?.images?.[0]?.url}
              alt={product.name?.["en-US"]}
              fill
              className="w-full h-auto object-contain rounded shadow"
            />
          </div>
        )}
        <div>
          {product?.name?.["en-US"] && (
            <h1 className="text-3xl mb-2">{product.name["en-US"]}</h1>
          )}
          {product?.masterVariant?.prices?.[0]?.value.centAmount && (
            <p className="text-xl text-gray-800 mb-2 font-semibold">
              ${product?.masterVariant?.prices?.[0]?.value.centAmount / 100}
            </p>
          )}

          <p className="text-sm text-gray-500 mb-4">{product.key}</p>
          <p className="text-gray-700 mb-4">{product.description?.["en-US"]}</p>

          <div className="mb-4">
            <h3 className="font-semibold mb-1">Key Features:</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {product?.masterVariant?.attributes?.map((feature, i) => (
                <li key={i}>{feature?.value?.["en-US"]}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                product?.masterVariant?.availability?.isOnStock
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product?.masterVariant?.availability?.isOnStock
                ? "In Stock"
                : "Out of Stock"}
            </span>
            <span className="text-sm text-yellow-600">⭐ 4 / 5</span>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="mt-4 w-full bg-black text-white py-2 rounded border hover:bg-white hover:text-black hover:border hover:border-black transition cursor-pointer font-semibold"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
