"use client";
import { useCart } from "@/context/CartContext";
import { ProductProps } from "@/dummyData/productsData";
import Image from "next/image";

const ProductDetailClient = ({ product }: { product: ProductProps }) => {
  const { addToCart } = useCart();
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={500}
          height={500}
          className="w-full h-auto rounded shadow"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-xl text-gray-800 mb-2">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {product.category} • {product.brand}
          </p>
          <p className="text-gray-700 mb-4">{product.description}</p>

          <div className="mb-4">
            <h3 className="font-semibold mb-1">Key Features:</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {product?.pros?.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                product.inStock
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
            <span className="text-sm text-yellow-600">
              ⭐ {product?.rating?.toFixed(1)} / 5
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="mt-4 w-full bg-cyan-900 text-white py-2 rounded hover:bg-cyan-700 transition cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
