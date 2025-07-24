import { connectStateResults } from "react-instantsearch-dom";

import type { SearchResults } from "algoliasearch-helper";

export const CustomFacetLogger = connectStateResults(
  ({ searchResults }: { searchResults?: SearchResults }) => {
    if (searchResults && searchResults.renderingContent) {
      console.log("Facet ordering:", searchResults.renderingContent.facetOrdering);
    }
    return null;
  }
);
