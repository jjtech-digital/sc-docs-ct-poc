import ProductCard from "@/components/ProductCard";
import { ProductProps, products } from "@/dummyData/productsData";
export default function Home() {
  return (
    <div className="m-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product: ProductProps) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
