"use client";
import {
  InstantSearch,
  Pagination,
  RefinementList,
  SortBy,
  connectHits,
  Stats,
} from "react-instantsearch-dom";
import searchClient from "@/lib/algoliaClient";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    width={24}
    height={24}
    fill={filled ? "#ff385c" : "none"}
    stroke="#333"
    strokeWidth={2}
    viewBox="0 0 24 24"
    className="hover:scale-105 transition-transform"
  >
    <path d="M12 21C12 21 5 13.76 5 8.5C5 5.47 7.47 3 10.5 3C12.04 3 13.54 3.81 14.26 5.03C14.98 3.81 16.48 3 18 3C21.03 3 23.5 5.47 23.5 8.5C23.5 13.76 12 21 12 21Z" />
  </svg>
);

const StarRating = ({ rating = 0, count = 0 }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <polygon points="9.9,1.1 12.3,7 18.7,7.6 13.6,11.9 15.2,18.2 9.9,14.6 4.7,18.2 6.3,11.9 1.2,7.6 7.6,7 " />
      </svg>
    ))}
    {count > 0 && <span className="text-xs text-gray-600 ml-1">({count})</span>}
  </div>
);

const locale = "en-GB";

type HitProps = {
  hit: {
    name?: Record<string, string>;
    slug?: Record<string, string>;
    objectID: string;
    variants?: Array<{
      images?: string[];
      prices?: {
        GBP?: {
          min?: number;
        };
      };
      attributes?: {
        ["color-label"]?: Record<string, string>;
        ["finish-label"]?: Record<string, string>;
      };
      isInStock?: boolean;
    }>;
    attributes?: {
      productspec?: Record<string, string>;
    };
    categories?: Record<string, { lvl2?: string[] }>;
    productType?: string;
    rrp?: number;
    badge?: string;
    reviewScore?: number;
    reviewCount?: number;
  };
};

const Hit = ({ hit }: HitProps) => {
  const [liked, setLiked] = useState(false);

  const name = hit.name?.[locale] || "Unnamed Product";
  const slug = hit.slug?.[locale] || hit.objectID;
  const image = hit.variants?.[0]?.images?.[0] || "/placeholder.png";
  const productSpec = hit.attributes?.productspec?.[locale];
  const productType = hit.productType;
  const priceRaw = hit.variants?.[0]?.prices?.GBP?.min;
  const rrpRaw = hit.rrp;
  const price = priceRaw ? priceRaw / 100 : 0;
  const rrp = rrpRaw ? rrpRaw / 100 : 0;
  const savings = rrp && price ? Math.round(((rrp - price) / rrp) * 100) : 0;
  const badge =
    hit.badge || (savings >= 50 ? "HOT DEAL" : savings > 0 ? "SALE" : null);
  const rating = hit.reviewScore || 0;
  const reviewCount = hit.reviewCount || 0;
  const colorLabel = hit.variants?.[0]?.attributes?.["color-label"]?.[locale];
  const finishLabel = hit.variants?.[0]?.attributes?.["finish-label"]?.[locale];
  const inStock = hit.variants?.[0]?.isInStock;

  return (
    <Link href={`/product/${slug}`} className="block">
      <div className="relative bg-white border rounded-lg shadow-sm p-4 flex flex-col h-full hover:shadow-lg transition">
        {badge && (
          <span
            className={`absolute left-2 top-2 px-2 py-0.5 rounded text-xs font-bold ${badge === "HOT DEAL" ? "bg-[#ff6e0d]" : "bg-[#e54747]"
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

        {productType && (
          <p className="text-xs text-gray-500 mb-1">{productType}</p>
        )}

        {(colorLabel || finishLabel) && (
          <p className="text-xs text-gray-600 mb-1">
            {colorLabel && <span className="mr-2">Color: {colorLabel}</span>}
            {finishLabel && <span>Finish: {finishLabel}</span>}
          </p>
        )}

        {productSpec && (
          <p className="text-xs text-gray-500 italic truncate mb-1">
            {productSpec}
          </p>
        )}
        {inStock && (
          <span className="inline-block bg-green-100 text-green-700 text-xs rounded px-2 py-0.5 mb-2">
            In Stock
          </span>
        )}

        <StarRating rating={rating} count={reviewCount} />

        <div className="mt-2">
          {rrp > price && (
            <p className="text-xs text-gray-400 line-through">
              RRP ${rrp.toFixed(2)}
            </p>
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

const CustomHits = connectHits(({ hits }: { hits: HitProps["hit"][] }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
    {hits.map((hit, index) => (
      <Hit key={hit.objectID || index} hit={hit} />
    ))}
  </div>
));

const ProductListingPage = () => (
  <InstantSearch indexName="dev_Products" searchClient={searchClient}>
    <div className="flex flex-col min-h-screen bg-[#f6f2ea]">
      <div className="flex flex-col lg:flex-row gap-6 max-w-[1520px] m-auto px-4 py-8 w-full">
        <aside className="lg:w-72 w-full max-w-full bg-white rounded-xl p-5 border border-gray-200 shadow-sm self-start min-h-[500px]">
          <button className="font-semibold text-sm flex items-center mb-4">
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
            Hide filters
          </button>
          <h2 className="font-semibold text-base mb-2">Subcategory</h2>
          <RefinementList attribute="category" />
          <div className="mt-4">
            <RefinementList attribute="brand" />
          </div>
        </aside>

        <main className="flex-1 w-full">
          <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
            <Stats
              translations={{
                stats(nbHits: number) {
                  return `${nbHits} product${nbHits !== 1 ? "s" : ""}`;
                },
              }}
            />

            <SortBy
              defaultRefinement="dev_Products"
              items={[
                { value: "dev_Products", label: "Recommended" },
                {
                  value: "dev_Products_price_asc",
                  label: "Price: Low to High",
                },
                {
                  value: "dev_Products_price_desc",
                  label: "Price: High to Low",
                },
              ]}
              className="ml-auto"
            />
          </div>
          <CustomHits />
          <div className="flex justify-center mt-8">
            <Pagination />
          </div>
        </main>
      </div>
    </div>
  </InstantSearch>
);

export default ProductListingPage;
