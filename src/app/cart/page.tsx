"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce(
    (total, item) => total + (item?.price?.centAmount / 100) * item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col gap-10 space-x-8 items-center md:flex-row md:gap-0">
      <div className="w-full p-2 md:flex-grow">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-b-cyan-600 py-3"
              >
                <Image
                  width={64}
                  height={64}
                  src={item.image}
                  alt={item.name?.["en-US"]}
                  className="w-16 h-16 object-contain rounded-md mr-4"
                />

                <div className="flex-grow">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} x ${item.price.centAmount / 100}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={clearCart}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
            >
              Clear Cart
            </button>
          </>
        )}
      </div>

      <div className="w-full md:w-1/3 p-4 bg-gray-100 rounded-md shadow-md items-start ">
        <h2 className="text-lg font-bold">Order Summary</h2>
        <div className="flex justify-between mt-4">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
        </div>
        <Link href="/checkout">
          <button
            className="mt-4 px-6 py-2 bg-cyan-700 text-white rounded w-full cursor-pointer"
            disabled={cart.length < 1}
          >
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}
