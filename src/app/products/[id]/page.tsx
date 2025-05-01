import { notFound } from "next/navigation";
import { products } from "@/dummyData/productsData";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  const product = products.find((p) => p.id === productId);

  if (!product) return notFound();

  return <ProductDetailClient product={product} />;
}
