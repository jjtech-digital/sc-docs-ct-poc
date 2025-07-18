'use client';

import {
  InstantSearch,
  SearchBox,
  Pagination,
  RefinementList,
  SortBy,
  connectHits,
} from 'react-instantsearch-dom';
import searchClient from '@/lib/algoliaClient';

const locale = 'en-GB';

// Types
interface HitProps {
  hit: {
    name?: Record<string, string>;
    price?: number;
    variants?: Array<{
      images?: string[];
    }>;
  };
}

const Hit = ({ hit }: HitProps) => {
  const productName = hit.name?.[locale] || 'Unnamed product';
  const productImage = hit.variants?.[0]?.images?.[0] || '/placeholder.png';
  const productPrice = (hit.price && hit.price / 100) || 0;

  return (
    <div className="bg-white border rounded shadow-sm p-4 hover:shadow-md transition duration-200">
      <img
        src={productImage}
        alt={productName}
        className="mb-3 w-full h-48 object-cover rounded"
      />
      <h3 className="text-sm font-semibold text-gray-900 truncate">{productName}</h3>
      <p className="text-primary text-base font-bold mt-1">
        ${productPrice.toFixed(2)}
      </p>
    </div>
  );
};


// ✅ CustomHits Component wrapped with `connectHits`
const CustomHits = connectHits(({ hits }: { hits: HitData[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
    {hits.map((hit, index) => (
      <Hit key={index} hit={hit} />
    ))}
  </div>
));

// ✅ Product Listing Page
const ProductListingPage = () => {
  return (
    <InstantSearch indexName="dev_Products" searchClient={searchClient}>
      <div className="flex flex-col lg:flex-row gap-6 p-4">
        <aside className="lg:w-1/4 space-y-4">
          <div>
            <h4 className="font-semibold mb-2 text-gray-800">Category</h4>
            <RefinementList attribute="category" />
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-gray-800">Brand</h4>
            <RefinementList attribute="brand" />
          </div>
        </aside>

        <main className="lg:w-3/4 w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <SearchBox
              translations={{ placeholder: 'Search for products…' }}
              className="w-full sm:w-1/2"
            />
            <SortBy
              defaultRefinement="dev_Products"
              items={[
                { value: 'dev_Products', label: 'Featured' },
                { value: 'dev_Products_price_asc', label: 'Price: Low to High' },
                { value: 'dev_Products_price_desc', label: 'Price: High to Low' },
              ]}
              className="w-full sm:w-1/2"
            />
          </div>

          {/* 👇 FIXED: Custom `Hits` with Grid */}
          <CustomHits />

          <div className="flex justify-center">
            <Pagination />
          </div>
        </main>
      </div>
    </InstantSearch>
  );
};

export default ProductListingPage;
