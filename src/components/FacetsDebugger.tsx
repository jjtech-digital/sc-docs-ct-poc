import React, { useState, useEffect } from "react";
import { fetchFacets } from "@/lib/algoliaClient";
import { FacetsSidebar } from "./FacetsSidebar";

type FacetsDebuggerProps = {
  showFilterClass?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onFiltersChange: (filters: string[]) => void;
};

export default function FacetsDebugger({
  showFilterClass = "",
  isOpen = true,
  onClose,
  onFiltersChange,
}: FacetsDebuggerProps) {
  const [checkedFacets, setCheckedFacets] = useState<
    Record<string, Set<string>>
  >({});
  const [facets, setFacets] = useState<Record<string, Record<string, number>>>(
    {}
  );
  useEffect(() => {
    fetchFacets().then((result) => {
      if (result) {
        setFacets(result);
      }
    });
  }, []);

  useEffect(() => {
    const facetFilters = Object.entries(checkedFacets).flatMap(
      ([facet, values]) =>
        Array.from(values).map((value) => `${facet}:${value}`)
    );

    fetchFacets(facetFilters).then((filteredFacets) => {
      setFacets(filteredFacets ?? {});
    });
  }, [checkedFacets, onFiltersChange]);

  return (
    <FacetsSidebar
      facets={facets}
      checkedFacets={checkedFacets}
      onFacetChange={setCheckedFacets}
      showFilterClass={showFilterClass}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}
