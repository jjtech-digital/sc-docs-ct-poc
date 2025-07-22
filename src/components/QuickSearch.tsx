"use client";

import React, { useState } from "react";
import { InstantSearch, connectAutoComplete } from "react-instantsearch-dom";
import searchClient from "@/lib/algoliaClient";
import Image from "next/image";

interface AutocompleteProps {
  hits: HitProps["hit"][];
  currentRefinement: string;
  refine: (value: string) => void;
}

const locale = "en-GB";

interface HitProps {
  hit: {
    name?: Record<string, string>;
    variants?: Array<{
      images?: string[];
    }>;
    slug?: Record<string, string>;
  };
}

const AutocompleteItem = ({ hit }: { hit: HitProps["hit"] }) => {
  const productName = hit.name?.[locale] || "Unnamed product";
  const productImage = hit.variants?.[0]?.images?.[0] || "/placeholder.png";
  const slug = hit.slug?.[locale] || "#";

  return (
    <a
      href={`/product/${slug}`}
      className="flex items-center gap-3 p-2 hover:bg-gray-100 transition-colors duration-150 rounded"
    >
      <Image
        src={productImage}
        alt={productName}
        width={48}
        height={48}
        className="w-12 h-12 rounded object-cover"
      />
      <span className="text-sm text-gray-800 truncate">{productName}</span>
    </a>
  );
};

const Autocomplete = ({
  hits,
  currentRefinement,
  refine,
}: AutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type="search"
        value={currentRefinement}
        onChange={(e) => {
          refine(e.currentTarget.value);
          setIsOpen(e.currentTarget.value.length > 0);
        }}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder="Quick search..."
        className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring"
      />
      {isOpen && hits.length > 0 && (
        <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded shadow overflow-hidden max-h-80 overflow-y-auto">
          {hits.map((hit: HitProps["hit"], index: number) => (
            <AutocompleteItem key={index} hit={hit} />
          ))}
        </div>
      )}
    </div>
  );
};

const CustomAutocomplete = connectAutoComplete(Autocomplete);

const QuickSearch = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName="dev_Products">
      <CustomAutocomplete />
    </InstantSearch>
  );
};

export default QuickSearch;
