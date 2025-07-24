"use client";

import {
  InstantSearch,
  Pagination,
  SortBy,
  Stats,
  DynamicWidgets,
  Configure,
  RefinementList,
} from "react-instantsearch-dom";
import searchClient from "@/lib/algoliaClient";
import { HitsWithSkeleton } from "@/components/HitsWithSkeleton";
import { CustomFacetLogger } from "@/components/CustomFacetLogger";
import FacetsDebugger from "@/components/FacetsDebugger";

const ProductListingPage = () => (
  <InstantSearch indexName="dev_Products" searchClient={searchClient}>
    <Configure facets={["*"]} maxValuesPerFacet={20} />
    <FacetsDebugger />
    <div className="flex flex-col min-h-screen bg-[#f6f2ea]">
      <div className="flex flex-col lg:flex-row gap-6 max-w-[1920px] m-auto px-4 py-8 w-full">
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

          <DynamicWidgets fallbackComponent={RefinementList} />
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

export default ProductListingPage;
