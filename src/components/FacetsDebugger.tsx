import React, { useState, useEffect } from "react";
import { fetchFacets } from "@/lib/algoliaClient";
import { FacetsSidebar } from "./FacetsSidebar";

type FacetsDebuggerProps = {
  showFilterClass?: string;
  isOpen?: boolean;
  onClose?: () => void;
};

export default function FacetsDebugger({
  showFilterClass = "",
  isOpen = true,
  onClose,
}: FacetsDebuggerProps) {
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

  return (
    <FacetsSidebar
      facets={facets}
      showFilterClass={showFilterClass}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}
