"use client";
import { useCart } from "@/context/CartContext";
import { ProductProps } from "@/types/ProductProps";
import Image from "next/image";
import { useEffect, useState } from "react";

const ProductDetailClient = ({ id }: { id: string }) => {
    const [product, setProduct] = useState<ProductProps>();
    const fetchProducts = async () => {
      const res = await fetch(`/api/products/${id}`, { headers : { "Content-Type": "application/json", "Accept-Language": "en-US" } });
      const response = await res.json();
      setProduct(response);
    }
    useEffect(()=> {
      fetchProducts();
    }, [])
  

  const { addToCart } = useCart();

  if(!product) {
    return null
  }
  
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {product?.masterVariant?.images?.[0]?.url && 
        <div className="w-full h-[500px] relative mr-5">
          <Image
          src={product?.masterVariant?.images?.[0]?.url}
          alt={product.name?.["en-US"]}
          fill
          className="w-full h-auto object-contain rounded shadow"
        />
        </div>
      }
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          {product?.masterVariant?.prices?.[0]?.value.centAmount && 
           <p className="text-xl text-gray-800 mb-2">
           ${product?.masterVariant?.prices?.[0]?.value.centAmount / 100}
         </p>}
         
          <p className="text-sm text-gray-500 mb-4">
            {product.key}
          </p>
          <p className="text-gray-700 mb-4">{product.description?.["en-US"]}</p>

          <div className="mb-4">
            <h3 className="font-semibold mb-1">Key Features:</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {product?.masterVariant?.attributes?.map((feature, i) => (
                <li key={i}>{feature?.value?.['en-US']}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                product?.masterVariant?.availability?.isOnStock
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product?.masterVariant?.availability?.isOnStock ? "In Stock" : "Out of Stock"}
            </span>
            <span className="text-sm text-yellow-600">
              ⭐ 4 / 5
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
