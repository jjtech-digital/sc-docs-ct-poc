import { connectHits } from "react-instantsearch-dom";
import { Hit } from "./Hits";

interface ProductHit {
  objectID: string;
  name: Record<string, string>;
  price: number;
  imageUrl: string;
  description: string;
}

type HitProps = {
  hit: ProductHit;
};

export const CustomHits = connectHits(({ hits }: { hits: HitProps["hit"][] }) => {
  if (hits.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] col-span-full text-gray-500 text-lg">
        No products found.
      </div>
    );
  }
console.log("Rendering hits:", hits);

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5 transition-all duration-300"
      style={{
        minHeight: `calc(var(--card-height, 200px) * var(--grid-rows, 5))`,
      }}
    >
      {hits.map((hit, index) => (
        <Hit key={hit.objectID || index} hit={hit} />
      ))}
    </div>
  );
});
