import algoliasearch from 'algoliasearch/lite';

export const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!);
const index = client.initIndex('dev_safetydocs');

export const fetchFacets = async () => {
  try { 
    const results = await index.search('', {
      facets: ['*'], 
      maxFacetHits: 100,
    });
    return results.facets;
  } catch (error) {
    console.error("Error fetching facets:", error);
    throw error;
  }
};

