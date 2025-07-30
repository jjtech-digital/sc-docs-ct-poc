"use client";
import { useCart } from "@/context/CartContext";
import { ProductProps } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ product }: { product: ProductProps }) => {
  const { id, name, image, variants, slug } = product;

  const { addToCart } = useCart();

  const productImage =
    image && image !== ""
      ? image
      : variants && variants[0]?.images && variants[0].images.length > 0
      ? variants[0].images[0]
      : "https://via.placeholder.com/300x300?text=No+Image";

  const variant = variants && variants[0];
  const centAmount =
    variant?.prices?.AUD?.min ?? variant?.prices?.AUD?.priceValues?.[0]?.value;

  if (!centAmount || !name?.["en-US"]) {
    return null;
  }

  return (
    <div
      className="max-w-xs rounded-xl overflow-hidden shadow-lg bg-white"
      key={id}
    >
      <Link href={`/products/${slug?.["en-US"]}`}>
        <div className="relative w-full h-64">
          <Image
            src={productImage}
            alt={name?.["en-US"] || "Product Image"}
            fill
            className="object-contain p-3"
          />
        </div>
      </Link>
      <div className="p-4">
        <h3 className="text-lg">{name ? name?.["en-US"] : "No name"}</h3>
        <p className="text-gray-700 mt-2 font-semibold">
          {centAmount !== undefined
            ? `$${(centAmount / 100).toFixed(2)}`
            : "Price unavailable"}
        </p>
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
