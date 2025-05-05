"use client";
import { useCart } from "@/context/CartContext";
import { ProductProps } from "@/dummyData/productsData";
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ product }: { product: ProductProps }) => {
  const { id, title, price, imageUrl } = product;
  const { addToCart } = useCart();
  return (
    <div
      className="max-w-xs rounded-xl overflow-hidden shadow-lg bg-white"
      key={id}
    >
      <Link href={`/products/${id}`}>
        <div className="relative w-full h-48">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-700 mt-2">${price.toFixed(2)}</p>
        <button
          onClick={() => addToCart(product)}
          className="mt-4 w-full bg-cyan-900 text-white py-2 rounded hover:bg-cyan-700 transition cursor-pointer"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
