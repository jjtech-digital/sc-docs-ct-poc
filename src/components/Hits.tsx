"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeartIcon } from "./HeartIcon";
import { StarRating } from "./StarRating";

const locale = "en-GB";

type HitProps = {
  hit: {
    name?: Record<string, string>;
    slug?: Record<string, string>;
    objectID: string;
    variants?: Array<{
      images?: string[];
      prices?: {
        GBP?: { min?: number };
      };
      attributes?: {
        ["color-label"]?: Record<string, string>;
        ["finish-label"]?: Record<string, string>;
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

  const name = hit.name?.[locale] ?? "Unnamed Product";
  const slug = hit.slug?.[locale] ?? hit.objectID;
  const image = hit.variants?.[0]?.images?.[0] ?? "/placeholder.png";
  const productSpec = hit.attributes?.productspec?.[locale];
  const productType = hit.productType;
  const priceRaw = hit.variants?.[0]?.prices?.GBP?.min;
  const rrpRaw = hit.rrp;
  const price = priceRaw ? priceRaw / 100 : 0;
  const rrp = rrpRaw ? rrpRaw / 100 : 0;
  const savings = rrp && price ? Math.round(((rrp - price) / rrp) * 100) : 0;
  const badge =
    hit.badge || (savings >= 50 ? "HOT DEAL" : savings > 0 ? "SALE" : null);
  const rating = hit.reviewScore ?? 0;
  const reviewCount = hit.reviewCount ?? 0;
  const colorLabel = hit.variants?.[0]?.attributes?.["color-label"]?.[locale];
  const finishLabel = hit.variants?.[0]?.attributes?.["finish-label"]?.[locale];
  const inStock = hit.variants?.[0]?.isInStock;

  return (
    <Link href={`/products/${slug}`} className="block">
      <div className="relative bg-white border rounded-lg shadow-sm p-4 flex flex-col h-auto hover:shadow-lg transition">
        {badge && (
          <span
            className={`absolute left-2 top-2 px-2 py-0.5 rounded text-xs font-bold ${
              badge === "HOT DEAL" ? "bg-[#ff6e0d]" : "bg-[#e54747]"
            } text-white z-10`}
          >
            {badge}
          </span>
        )}

        <button
          className="absolute top-2 right-2 z-10"
          aria-label="Toggle wishlist"
          onClick={(e) => {
            e.preventDefault();
            setLiked((l) => !l);
          }}
        >
          <HeartIcon filled={liked} />
        </button>

        <Image
          src={image}
          alt={name}
          width={400}
          height={144}
          className="w-full h-36 object-contain bg-[#f9f7f2] rounded mb-3"
          unoptimized={image === "/placeholder.png"}
        />

        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
          {name}
        </h3>

        {productType && <p className="text-xs text-gray-500 mb-1">{productType}</p>}

        {(colorLabel || finishLabel) && (
          <p className="text-xs text-gray-600 mb-1">
            {colorLabel && <span className="mr-2">Color: {colorLabel}</span>}
            {finishLabel && <span>Finish: {finishLabel}</span>}
          </p>
        )}

        {productSpec && (
          <p className="text-xs text-gray-500 italic truncate mb-1">{productSpec}</p>
        )}

        {inStock && (
          <span className="inline-block bg-green-100 text-green-700 text-xs rounded px-2 py-0.5 mb-2">
            In Stock
          </span>
        )}

        <StarRating rating={rating} count={reviewCount} />

        <div className="mt-2">
          {rrp > price && (
            <p className="text-xs text-gray-400 line-through">RRP ${rrp.toFixed(2)}</p>
          )}
          <p className="text-base font-bold text-orange-600">
            ${price.toFixed(2)}
            {savings > 0 && (
              <span className="ml-1 text-xs text-gray-600 font-medium">
                ({savings}% OFF)
              </span>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
};
