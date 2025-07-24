import { connectStateResults } from "react-instantsearch-dom";
import { CustomHits } from "./CustomHits";
import { SkeletonCard } from "./SkeletonCard";

export const HitsWithSkeleton = connectStateResults(
  ({
    searchResults,
    isSearchStalled,
  }: {
    searchResults?: { hits?: Record<string, unknown>[] };
    isSearchStalled: boolean;
  }) => {
    console.log("Search results:", searchResults, "Stalled:", isSearchStalled);
    
    if (isSearchStalled || !searchResults) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
          {Array.from({ length: 10 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }
    return <CustomHits hits={searchResults.hits || []} />;
  }
);
