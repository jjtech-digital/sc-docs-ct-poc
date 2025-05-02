"use client";
import { useCart } from "@/context/CartContext";
import { ProductProps } from "@/types/ProductProps";
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
        <h3 className="text-lg font-semibold">{name?.["en-US"]}</h3>
        <p className="text-gray-700 mt-2">${price.centAmount / 100}</p>
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
