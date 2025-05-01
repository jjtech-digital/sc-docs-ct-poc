// src/components/Header.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const { cart } = useCart();
  const itemCount = cart.length;

  return (
    <div className="flex justify-between items-center h-12 px-4 w-full bg-cyan-700 text-white">
      <Link href="/">
        <div className="text-lg font-semibold">CT Checkout Demo</div>
      </Link>

      <Link href="/cart">
        <div className="relative inline-block">
          <button className="bg-white text-cyan-700 px-3 py-1 rounded font-medium cursor-pointer">
            Cart
          </button>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Header;
