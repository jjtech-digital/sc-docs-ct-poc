import { useEffect } from "react";

const FacetsDebugger = () => {
  useEffect(() => {
    const fetchFacetedSearch = async () => {
      const url = "https://82vvnxg0dn-dsn.algolia.net/1/indexes/*/queries";
      const body = {
        requests: [
          {
            indexName: "dev_Products",
            params: new URLSearchParams({
              facets: '["*"]',
              maxValuesPerFacet: "20",
              page: "0",
            }).toString(),
          },
        ],
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "X-Algolia-API-Key": "21d2f7c173e33c23d9ed1b29c8b53e39",
          "X-Algolia-Application-Id": "82VVNXG0DN",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      console.log("Faceted search response:", data,response);
    };

    fetchFacetedSearch();
  }, []);

  return null; 
};

export default FacetsDebugger;
