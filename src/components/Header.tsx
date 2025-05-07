"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartIcon from "@/icons/CartIcon";

const Header = () => {
  const { cart } = useCart();
  const itemCount = cart?.lineItems?.length || 0;

  return (
    <div className="flex justify-between items-center h-12 p-4 w-full bg-black text-white">
      <Link href="/">
        <div className="text-lg font-semibold">CT Checkout Demo</div>
      </Link>

      <div className="flex items-center space-x-2">
      <Link href="/cart">
        <div className="relative inline-block">
          <button className="bg-transparent border-0 text-white px-3 py-1 rounded font-medium cursor-pointer ">
            <CartIcon />
          </button>
          {itemCount > 0 && (
            <span className="absolute top-0 right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
      </Link>
      <Link href="/login">
        <button className="bg-transparent border-0 text-white px-3 py-1 rounded font-medium cursor-pointer underline">
          Login
        </button>
        </Link>
        or
        <Link href="/signup">
        <button className="bg-transparent border-0 text-white px-3 py-1 rounded font-medium cursor-pointer underline">
          Signup
        </button>
        </Link>
      </div>
      
    </div>
  );
};

export default Header;
