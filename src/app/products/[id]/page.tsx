import { useCart } from "@/context/CartContext";
import { products } from "@/dummyData/productsData";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

type ProductPageProps = {
  params: { id: string };
};

const ProductPage = async ({ params }: ProductPageProps) => {
  const productId = Number(params?.id);
  const product = products.find((p) => p.id === productId);

  if (!product) return notFound();

  return <ProductDetailClient product={product} />;
};

export default ProductPage;
