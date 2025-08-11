"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeartIcon } from "./HeartIcon";
import { StarRating } from "./StarRating";
import { useCart } from "@/context/CartContext";

const locale = "en-GB";

type HitProps = {
  hit: {
    name?: Record<string, string>;
    slug?: Record<string, string>;
    key?: string;
    objectID: string;
    variants?: Array<{
      images?: string[];
      prices?: {
        GBP?: { min?: number };
        AUD?: { min?: number };
      };
      attributes?: {
        ["color-label"]?: Record<string, string>;
        ["finish-label"]?: Record<string, string>;
        productspec?: Record<string, string>;
        brand?: string;
      };
      isInStock?: boolean;
    }>;
    attributes?: { productspec?: Record<string, string> };
    categories?: Record<string, { lvl2?: string[] }>;
    productType?: string;
    rrp?: number;
    badge?: string;
    reviewScore?: number;
    reviewCount?: number;
  };
};

export const Hit = ({ hit }: HitProps) => {
  const [liked, setLiked] = useState(false);
  const { addToCart } = useCart();

  console.log("[Hit Component] Rendering hit:", hit);

  const name =
    hit.name?.[locale] ||
    hit.productType ||
    hit.key ||
    hit.objectID ||
    "Unnamed Product";

  const slug = hit.slug?.[locale] || hit.key || hit.objectID;

  const image = hit.variants?.[0]?.images?.[0] ?? "/placeholder.png";

  const productSpec =
    hit.attributes?.productspec?.[locale] ||
    hit.variants?.[0]?.attributes?.productspec?.[locale];

  const priceRaw =
    hit.variants?.[0]?.prices?.GBP?.min ?? hit.variants?.[0]?.prices?.AUD?.min;

  const rrpRaw = hit.rrp;
  const price = priceRaw ? priceRaw / 100 : 0;
  const rrp = rrpRaw ? rrpRaw / 100 : 0;

  if (!priceRaw || price <= 0) {
    console.warn(
      `[Hit Component] Skipping ${name} because no valid price found`,
      priceRaw
    );
    return null;
  }

  const savings = rrp && price ? Math.round(((rrp - price) / rrp) * 100) : 0;

  const badge =
    hit.badge || (savings >= 50 ? "HOT DEAL" : savings > 0 ? "SALE" : null);

  const rating = hit.reviewScore ?? 0;
  const reviewCount = hit.reviewCount ?? 0;
  const colorLabel = hit.variants?.[0]?.attributes?.["color-label"]?.[locale];
  const finishLabel = hit.variants?.[0]?.attributes?.["finish-label"]?.[locale];
  const inStock = hit.variants?.[0]?.isInStock;

  return (
    <div
      className="w-full md:max-w-xs bg-white rounded-2xl border border-gray-100 shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col relative"
      key={hit.objectID}
    >
      {badge && (
        <span
          className={`absolute left-3 top-3 px-3 py-1 rounded-full text-xs font-bold z-10 shadow-md ${
            badge === "HOT DEAL"
              ? "bg-gradient-to-r from-orange-500 to-red-500"
              : "bg-gradient-to-r from-red-500 to-red-600"
          } text-white`}
        >
          {badge}
        </span>
      )}

      <button
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
        aria-label="Toggle wishlist"
        onClick={(e) => {
          e.preventDefault();
          setLiked((l) => !l);
        }}
      >
        <HeartIcon filled={liked} />
      </button>

      <Link
        href={`/products/${slug}`}
        className="group relative block w-full h-64 rounded-t-2xl overflow-hidden bg-gray-50"
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          unoptimized={image === "/placeholder.png"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity rounded-t-2xl pointer-events-none" />
      </Link>

      <div className="p-3 flex flex-col flex-grow">
        <h3
          className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight min-h-[2rem]"
          title={name}
        >
          {name}
        </h3>

        {hit.productType && (
          <p className="text-sm text-indigo-600 font-medium mb-2">
            {hit.productType}
          </p>
        )}

        {(colorLabel || finishLabel) && (
          <div className="flex flex-wrap gap-2 mb-2">
            {colorLabel && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                {colorLabel}
              </span>
            )}
            {finishLabel && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                {finishLabel}
              </span>
            )}
          </div>
        )}

        {productSpec && (
          <p className="text-xs text-gray-500 italic line-clamp-2 mb-2">
            {productSpec}
          </p>
        )}

        {inStock && (
          <span className="w-fit inline-block bg-green-100 text-green-700 text-xs font-medium rounded-full px-3 py-1 mb-3">
            ✓ In Stock
          </span>
        )}

        <div className="mb-2">
          <StarRating rating={rating} count={reviewCount} />
        </div>

        <div className="mb-2">
          {rrp > price && (
            <p className="text-sm text-gray-500 line-through mb-1">
              RRP ${rrp.toFixed(2)}
            </p>
          )}
          <div className="flex items-center gap-2">
            <p className="text-indigo-600 font-extrabold text-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
              ${price.toFixed(2)}
            </p>
            {savings > 0 && (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                {savings}% OFF
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => addToCart(hit.objectID)}
          className="mt-auto bg-indigo-600 text-white font-semibold py-2.5 rounded-lg shadow-md hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Add ${name} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
