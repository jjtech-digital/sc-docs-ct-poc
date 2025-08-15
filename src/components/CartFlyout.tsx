"use client";

import { useCart } from "@/context/CartContext";
import { useEffect } from "react";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartFlyout() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateCartQuantity,
    isLoading,
  } = useCart();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const cartItems = cart?.lineItems || [];
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart?.totalPrice?.centAmount
    ? (cart.totalPrice.centAmount / 100).toFixed(2)
    : "0.00";
console.log("cartItems", cartItems);

  return (
    <>
      <div
        className="fixed inset-0 bg-opacity-50 z-40 transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-500 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart ({totalItems})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-4">
                Add some products to get started
              </p>
              <button
                onClick={closeCart}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cartItems.map((item) => {
                const itemName =
                  item.name?.["en-US"] || item.name?.["en-GB"] || "Product";
                const itemImage =
                  item.variant?.images?.[0]?.url ||
                  "https://via.placeholder.com/80x80";
                const itemPrice = item.price?.value?.centAmount
                  ? (item.price.value.centAmount / 100).toFixed(2)
                  : "0.00";
                const totalItemPrice = item.totalPrice?.centAmount
                  ? (item.totalPrice.centAmount / 100).toFixed(2)
                  : "0.00";

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="relative w-16 h-16 bg-white rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item?.image || itemImage}
                        alt={itemName}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-medium text-gray-900"
                        title={itemName}
                      >
                        {item?.name?.["en"] || "Product"}
                      </h4>
                      <p className="text-sm text-gray-500">${itemPrice} each</p>
                      <p className="text-sm font-medium text-indigo-600">
                        ${totalItemPrice}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 bg-white rounded-md border">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1 hover:bg-gray-100 rounded-l-md transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1 hover:bg-gray-100 rounded-r-md transition-colors"
                        >
                          <Plus className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-gray-900">
                Total:
              </span>
              <span className="text-xl font-bold text-indigo-600">
                ${totalPrice}
              </span>
            </div>

            <div className="space-y-2">
              <Link
                href="/cart"
                onClick={closeCart}
                className="block w-full bg-indigo-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={closeCart}
                className="block w-full bg-gray-100 text-gray-900 text-center py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
