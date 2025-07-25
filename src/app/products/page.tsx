"use client";

import React, { useState } from "react";
import {
  InstantSearch,
  Pagination,
  SortBy,
  Stats,
  Configure,
} from "react-instantsearch-dom";
import { HitsWithSkeleton } from "@/components/HitsWithSkeleton";
import { CustomFacetLogger } from "@/components/CustomFacetLogger";
import FacetsDebugger from "@/components/FacetsDebugger";
import { searchClient } from "@/lib/algoliaClient";

const ProductListingPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [facetFilters, setFacetFilters] = useState<string[]>([]);
console.log("facetFilters", facetFilters);

  return (
    <InstantSearch indexName="dev_safetydocs" searchClient={searchClient}>
    <Configure
  facets={["*"]}
  maxValuesPerFacet={20}
  facetFilters={facetFilters.length ? facetFilters : undefined}
/>


      <div className="max-w-[1920px] m-auto px-4 py-8 w-full">
        <button
          className="font-semibold text-sm flex items-center mb-4"
          onClick={() => setShowFilters((f) => !f)}
          type="button"
        >
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
          {showFilters ? "Hide filters" : "Show filters"}
        </button>

        <div
          className={`min-h-screen bg-[#f6f2ea] flex max-w-[1920px] m-auto px-4 py-8 w-full gap-4 ${
            showFilters ? "flex-row" : "flex-col"
          }`}
        >
          {showFilters && (
            <FacetsDebugger
              showFilterClass=""
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
              onFiltersChange={setFacetFilters}
            />
          )}

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
                defaultRefinement="dev_safetydocs"
                items={[
                  { value: "dev_safetydocs", label: "Recommended" },
                  {
                    value: "dev_safetydocs_price_asc",
                    label: "Price: Low to High",
                  },
                  {
                    value: "dev_safetydocs_price_desc",
                    label: "Price: High to Low",
                  },
                ]}
                className="ml-auto"
              />
            </div>

            <HitsWithSkeleton />
            <CustomFacetLogger />

            <div className="flex justify-center mt-8">
              <Pagination />
            </div>
          </main>
        </div>
      </div>
    </InstantSearch>
  );
};

export default ProductListingPage;
