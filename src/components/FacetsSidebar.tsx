"use client";

import React, { useState, useEffect } from "react";
import MiniChevronUp from "./MiniChevronUp";

type FacetsSidebarProps = {
  facets?: Record<string, Record<string, number>>;
  checkedFacets: Record<string, Set<string>>;
  onFacetChange: (checkedFacets: Record<string, Set<string>>) => void;
  showFilterClass?: string;
  isOpen?: boolean;
  onClose?: () => void;
};

export function FacetsSidebar({
  facets = {},
  checkedFacets,
  onFacetChange,
  showFilterClass = "",
  isOpen = true,
  onClose,
}: FacetsSidebarProps) {
  const [expandedFacets, setExpandedFacets] = useState<Record<string, boolean>>(
    {}
  );
  console.log("facets", facets);
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const keys = Object.keys(facets).sort();
    setOpenSections(
      keys.reduce<Record<string, boolean>>((acc, key, idx) => {
        acc[key] = idx === 0;
        return acc;
      }, {})
    );
  }, [facets]);

  const handleCheck = (facetKey: string, facetValue: string) => {
  const newCheckedFacets = { ...checkedFacets };
  const currentSet = new Set(checkedFacets[facetKey] || []);
  if (currentSet.has(facetValue)) {
    currentSet.delete(facetValue);
    if (currentSet.size === 0) {
      delete newCheckedFacets[facetKey];
    } else {
      newCheckedFacets[facetKey] = currentSet;
    }
  } else {
    currentSet.add(facetValue);
    newCheckedFacets[facetKey] = currentSet;
  }
  onFacetChange(newCheckedFacets);
};


  const handleToggleExpand = (facetKey: string) => {
    setExpandedFacets((prev) => ({
      ...prev,
      [facetKey]: !prev[facetKey],
    }));
  };

  const handleSectionToggle = (facetKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [facetKey]: !prev[facetKey],
    }));
  };

  const handleClearAll = () => {
    onFacetChange({});
  };

  const isChecked = (facetKey: string, facetValue: string) =>
    checkedFacets[facetKey]?.has(facetValue) ?? false;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-72 bg-white p-5 border-r border-gray-200 shadow-lg overflow-y-auto
          transition-transform transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:shadow-none lg:border-none lg:overflow-visible lg:w-80
          rounded-r-lg
          min-h-full
          ${showFilterClass}
        `}
        aria-label="Facets filters"
      >
        <div className="lg:hidden flex justify-end mb-4">
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {Object.entries(facets)
          .sort()
          .map(([facetKey, facetValues]) => {
            const options = Object.entries(facetValues).filter(
              ([value, count]) => !!value && count > 0
            );
            const isExpanded = expandedFacets[facetKey];
            const hasMore = options.length > 5;
            const shownOptions = isExpanded ? options : options.slice(0, 5);
            const sectionOpen = openSections[facetKey] ?? false;

            return (
              <div key={facetKey} className="mb-6">
                <button
                  className="flex items-center justify-between w-full px-0 py-2 font-semibold text-left focus:outline-none"
                  type="button"
                  onClick={() => handleSectionToggle(facetKey)}
                  aria-expanded={sectionOpen}
                  aria-controls={`${facetKey}-content`}
                >
                  <span className="capitalize">
                    {facetKey.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span
                    style={{
                      transition: "transform 0.2s",
                      transform: sectionOpen ? "rotate(90deg)" : "rotate(0deg)",
                      display: "inline-block",
                    }}
                  >
                    <MiniChevronUp width={20} height={20} />
                  </span>
                </button>
                {sectionOpen && (
                  <>
                    <ul id={`${facetKey}-content`} className="space-y-1 mt-2">
                      {shownOptions.map(([value, count]) => (
                        <li key={value} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`${facetKey}--${value}`}
                            checked={isChecked(facetKey, value)}
                            onChange={() => handleCheck(facetKey, value)}
                            className="accent-[black] w-full max-w-4 h-full max-h-4 mr-2"
                          />
                          <label
                            htmlFor={`${facetKey}--${value}`}
                            className="flex-grow cursor-pointer select-none"
                          >
                            <span className="mr-2">{value}</span>
                            <span className="text-xs text-gray-500 font-medium">
                              ({count})
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                    {hasMore && (
                      <button
                        onClick={() => handleToggleExpand(facetKey)}
                        className="text-sm text-blue-600 font-medium mt-1 focus:outline-none"
                        type="button"
                      >
                        {isExpanded
                          ? "Show fewer values"
                          : `Show more values (+${options.length - 5})`}
                      </button>
                    )}
                  </>
                )}
                <hr className="mt-4 border-t border-gray-200" />
              </div>
            );
          })}
        <button
          onClick={handleClearAll}
          className="mt-2 w-full py-2 bg-gray-100 text-sm font-medium rounded hover:bg-gray-200"
          type="button"
        >
          Clear all
        </button>
      </aside>
    </>
  );
}
