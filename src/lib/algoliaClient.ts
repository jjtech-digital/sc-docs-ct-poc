import algoliasearch from 'algoliasearch';

export const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!);
const index = client.initIndex('dev_safetydocs');

// Search with facets
export const fetchFacets = async () => {
  try { 
    const results = await index.search('', {
      facets: ['*'], // Get all facets
      maxFacetHits: 100, // Increase if you need more facet values
    });
    return results.facets;
  } catch (error) {
    console.error("Error fetching facets:", error);
    throw error;
  }
};

const results = await fetchFacets();

console.log("dsbfjsd",results);