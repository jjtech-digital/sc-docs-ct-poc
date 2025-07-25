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
  const [facets, setFacets] = useState<Record<string, Record<string, number>>>(
    {}
  );

  const [checkedFacets, setCheckedFacets] = useState<
    Record<string, Set<string>>
  >({});

  useEffect(() => {
    fetchFacets().then((result) => {
      if (result) {
        setFacets(result);
      }
    });
  }, []);

  useEffect(() => {
    const facetFilters: string[] = [];
    for (const [facetName, selectedValues] of Object.entries(checkedFacets)) {
      selectedValues.forEach((value) => {
        facetFilters.push(`${facetName}:${value}`);
      });
    }
    onFiltersChange(facetFilters);
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
