import { connectStateResults } from "react-instantsearch-dom";

import type { SearchResults } from "algoliasearch-helper";

interface StateResultsProps {
  searchResults?: SearchResults;
}

const CustomFacetLogger = connectStateResults(
  ({ searchResults }: StateResultsProps) => {
    if (!searchResults) return null;

    const brandFacets = searchResults.getFacetValues("brand", {});
    const categoryFacets = searchResults.getFacetValues("category", {});

    console.log("Brand Facets:", brandFacets);
    console.log("Category Facets:", categoryFacets);

    return null;
  }
);

export default CustomFacetLogger;
