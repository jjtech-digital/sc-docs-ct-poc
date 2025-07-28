import React, { useState, useEffect } from "react";
import { fetchFacets } from "@/lib/algoliaClient";
import { FacetsSidebar } from "./FacetsSidebar";

type FacetsDebuggerProps = {
  onFiltersChange: (filters: string[]) => void;
  isOpen?: boolean;
  onClose?: () => void;
  showFilterClass?: string;
};

export default function FacetsDebugger({
  onFiltersChange,
  isOpen = true,
  onClose,
  showFilterClass = "",
}: FacetsDebuggerProps) {
  const [facets, setFacets] = useState<Record<string, Record<string, number>>>({});
  const [checkedFacets, setCheckedFacets] = useState<Record<string, Set<string>>>({});

  useEffect(() => {
    fetchFacets().then((result) => {
      setFacets(result ?? {});
    });
  }, []);

useEffect(() => {
  const facetFilters = Object.entries(checkedFacets).flatMap(
    ([facet, values]) =>
      Array.from(values).map((value) => `${facet}:${value}`)
  );

  if (onFiltersChange) {
    onFiltersChange(facetFilters);
  }

  fetchFacets(facetFilters)
    .then((filteredFacets) => {
      setFacets(filteredFacets ?? {});
    })
    .catch((error) => {
      console.error("Error fetching filtered facets", error);
      setFacets({});
    });
}, [checkedFacets, onFiltersChange]);

  

  return (
    <FacetsSidebar
      facets={facets}
      checkedFacets={checkedFacets}
      onFacetChange={setCheckedFacets}
      isOpen={isOpen}
      onClose={onClose}
      showFilterClass={showFilterClass}
    />
  );
}
