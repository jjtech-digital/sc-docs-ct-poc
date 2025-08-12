"use client";

import { useCart } from "@/context/CartContext";
import { ProductProps } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ product }: { product: ProductProps }) => {
  const { addToCart } = useCart();

  const productId = product.objectID || product.id || product.key || "";

  type LocalizedName = { [locale: string]: string };
  const name: LocalizedName | undefined = (product as { name?: LocalizedName })
    .name;
  const productName =
    name?.["en-US"] || name?.["en-GB"] || product.key || "Unnamed Product";

  const variant = product.variants?.[0];

  let productImage = "https://via.placeholder.com/300x300?text=No+Image";
  if (product.image && product.image !== "") {
    productImage = product.image;
  } else if (variant?.images?.length) {
    const firstImage = variant.images[0];
    productImage =
      typeof firstImage === "string"
        ? firstImage
        : (firstImage as { value: string })?.value || productImage;
  }

  const centAmount =
    variant?.prices?.AUD?.min ?? variant?.prices?.AUD?.priceValues?.[0]?.value;

  if (!centAmount) {
    return null;
  }

  return (
    <div
      className="
        w-full md:max-w-xs 
        bg-white rounded-2xl border border-gray-100 
        shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl
        flex flex-col
      "
      key={productId}
    >
      <Link
        href={`/products/${
          (product.slug && "en-US" in product.slug && product.slug["en-US"]) ||
          (product.slug && "en-GB" in product.slug && product.slug["en-GB"]) ||
          product.key ||
          productId
        }`}
        className="group relative block w-full h-64 rounded-t-2xl overflow-hidden bg-gray-50"
      >
        <Image
          src={productImage}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          priority={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity rounded-t-2xl pointer-events-none" />
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <h3
          className="text-lg font-semibold text-gray-900 mb-2 truncate leading-tight"
          title={productName}
        >
          {productName}
        </h3>
        <p
          className="
            text-indigo-600 font-extrabold text-xl mb-4
            bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 bg-clip-text text-transparent
          "
          aria-label={`Price: $${(centAmount / 100).toFixed(2)}`}
        >
          {`$${(centAmount / 100).toFixed(2)}`}
        </p>
        <button
          onClick={() => addToCart(productId)}
          className="
            mt-auto 
            bg-indigo-600 text-white font-semibold py-2 rounded-lg
            shadow-md hover:bg-indigo-700 active:bg-indigo-800
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            transition-colors duration-300
            cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          aria-label={`Add ${productName} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
