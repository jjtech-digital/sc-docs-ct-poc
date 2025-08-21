"use client";
import React, { useState, useEffect } from "react";
import { InstantSearch, connectAutoComplete } from "react-instantsearch-dom";
import Image from "next/image";
import { searchClient } from "@/lib/algoliaClient";

interface AutocompleteProps {
  hits: HitProps["hit"][];
  currentRefinement: string;
  refine: (value: string) => void;
}

const locale = "en-GB";

interface HitProps {
  hit: {
    key: string;
    name?: Record<string, string>;
    variants?: Array<{
      images?: string[];
    }>;
    slug?: Record<string, string>;
  };
}

type AlgoliaHit = {
  objectID: string;
  key?: string;
  name?: Record<string, string>;
  variants?: Array<{ images?: string[] }>;
  slug?: Record<string, string>;
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

function mapAlgoliaHitToLocalHit(hit: Partial<AlgoliaHit>): HitProps["hit"] {
  return {
    key: typeof hit.key === "string" ? hit.key : hit.objectID ?? "unknown",
    name: hit.name && typeof hit.name === "object" ? hit.name : undefined,
    variants: Array.isArray(hit.variants) ? hit.variants : undefined,
    slug: hit.slug && typeof hit.slug === "object" ? hit.slug : undefined,
  };
}

const AutocompleteItem = ({ hit }: { hit: HitProps["hit"] }) => {
  const productName =
    hit.name?.[locale] ||
    (hit.slug?.[locale]
      ? capitalize(hit.slug[locale].replace(/-/g, " "))
      : typeof hit.key === "string"
      ? capitalize(hit.key.replace(/-/g, " "))
      : hit.key) ||
    "Unnamed product";
  const productImage = hit.variants?.[0]?.images?.[0] || "/placeholder.png";
  const slug = hit.key;
  console.log("hit", hit);

  return (
    <a
      href={`/products/${slug}`}
      className="group flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-b border-gray-100 last:border-b-0 hover:shadow-sm"
    >
      <div className="relative flex-shrink-0">
        <Image
          src={productImage}
          alt={productName}
          width={56}
          height={56}
          className="w-14 h-14 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow duration-200"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-black/5 group-hover:to-black/10 transition-all duration-200"></div>
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-gray-900 truncate block group-hover:text-indigo-700 transition-colors duration-200">
          {productName}
        </span>
        <div className="w-0 group-hover:w-6 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 mt-1 transition-all duration-300 ease-out"></div>
      </div>
      <svg
        className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </a>
  );
};

const Autocomplete = ({
  hits,
  currentRefinement,
  refine,
}: AutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [popularProducts, setPopularProducts] = useState<HitProps["hit"][]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setIsLoadingPopular(true);
        const response = await searchClient.search([
          {
            indexName: "dev_safetydocs",
            query: "",
            params: {
              hitsPerPage: 6,
            },
          },
        ]);

        if (response.results[0] && "hits" in response.results[0]) {
          setPopularProducts(
            response.results[0].hits.map(mapAlgoliaHitToLocalHit)
          );
        }
      } catch (error) {
        console.error("Error fetching popular products:", error);
        setPopularProducts([]);
      } finally {
        setIsLoadingPopular(false);
      }
    };

    fetchPopularProducts();
  }, []);

  const displayHits = currentRefinement.length > 0 ? hits : popularProducts;
  console.log("dev_safetydocs", displayHits);

  return (
    <div className="relative w-full max-w-[600px]">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className={`w-5 h-5 transition-colors duration-200 ${
              isFocused ? "text-indigo-500" : "text-gray-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="search"
          value={currentRefinement}
          onChange={(e) => {
            refine(e.currentTarget.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setIsOpen(false), 200);
          }}
          placeholder="Search for products..."
          className="w-full pl-12 pr-4 py-3.5 text-gray-900 placeholder-gray-500 bg-white border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-sm font-medium"
        />

        {currentRefinement && (
          <button
            onClick={() => {
              refine("");
              setIsOpen(true);
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-2">
          <div
            className={`bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-96 overflow-y-auto transform transition-all duration-200 ${
              displayHits.length > 0
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}
            style={{
              background:
                "linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)",
            }}
          >
            {displayHits.length > 0 ? (
              <>
                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {currentRefinement.length > 0
                        ? "Search Results"
                        : "Popular Products"}
                    </span>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                      {displayHits.length}{" "}
                      {currentRefinement.length > 0 ? "found" : "items"}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {displayHits.map((hit: HitProps["hit"], index: number) => (
                    <AutocompleteItem
                      key={`${hit.slug?.[locale] || "item"}-${index}`}
                      hit={hit}
                    />
                  ))}
                </div>

                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                  <div className="flex items-center justify-center">
                    <span className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-200 rounded">
                        ↵
                      </kbd>
                      to select
                    </span>
                  </div>
                </div>
              </>
            ) : isLoadingPopular && currentRefinement.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  Loading products...
                </p>
              </div>
            ) : currentRefinement && hits.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  No products found
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Try adjusting your search terms
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

const CustomAutocomplete = connectAutoComplete((props: AutocompleteProps) => {
  // Map Algolia hits to local type for type safety
  const safeHits = props.hits.map(mapAlgoliaHitToLocalHit);
  return <Autocomplete {...props} hits={safeHits} />;
});

const QuickSearch = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName="dev_safetydocs">
      <CustomAutocomplete />
    </InstantSearch>
  );
};

export default QuickSearch;
