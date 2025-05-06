"use client";
import { useCart } from "@/context/CartContext";
import { ProductProps } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ product }: { product: ProductProps }) => {
  const { id, price, name, image } = product;
  const { addToCart } = useCart();
  return (
    <div
      className="max-w-xs rounded-xl overflow-hidden shadow-lg bg-white"
      key={id}
    >
      <Link href={`/products/${id}`}>
        <div className="relative w-full h-64">
          <Image
            src={image}
            alt={name?.["en-US"]}
            fill
            className="object-contain p-3"
          />
        </div>
      </Link>
      <div className="p-4">
        <h3 className="text-lg">{name?.["en-US"]}</h3>
        <p className="text-gray-700 mt-2 font-semibold">${price.centAmount / 100}</p>
        <button
          onClick={() => addToCart(product.id)}
          className="mt-4 w-full bg-black text-white py-2 rounded border hover:bg-white hover:text-black hover:border hover:border-black transition cursor-pointer font-semibold"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
