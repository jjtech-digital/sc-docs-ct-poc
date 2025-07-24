"use client";

import algoliasearch from "algoliasearch";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

const index = searchClient.initIndex("dev_Products");

export async function fetchFacets(query = "") {
  const facetAttributes = ['*'];

  const result = await index.search(query, {
    facets: facetAttributes,
    maxValuesPerFacet: 100, 
    hitsPerPage: 20,
  });

  return result;
}

export default searchClient;
