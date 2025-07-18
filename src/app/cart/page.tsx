"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CartItem } from "@/types/types";
import Cookies from "js-cookie";
import { paymentFlow } from "@commercetools/checkout-browser-sdk";
import { useRouter } from "next/navigation";

function generateOrderNumber() {
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestampPart = Date.now().toString(36).slice(-2).toUpperCase();
  return `ORD-${timestampPart}${randomPart}`;
}

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateCartQuantity, isLoading } =
    useCart();

  const router = useRouter();

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (cart?.lineItems && cart.lineItems.length > 0) {
      const initialQuantities = cart.lineItems.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {} as { [key: string]: number });

      setQuantities(initialQuantities);
    }
  }, [cart?.lineItems]);

  const handleQuantityChange = (id: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleUpdateQuantity = (id: string) => {
    if (quantities[id]) {
      updateCartQuantity(id, quantities[id]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (!cart?.lineItems || cart.lineItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/">
          <button className="mt-4 w-full bg-black text-white p-2 rounded border hover:bg-white hover:text-black hover:border hover:border-black transition cursor-pointer font-semibold">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  const startCheckoutFlow = async () => {
    const cookie = Cookies.get("user");
    if (cookie) {
      try {
        const json = JSON.parse(cookie);

        const res = await fetch(
          "https://session.australia-southeast1.gcp.commercetools.com/sc-docs-poc/sessions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${json.access_token}`,
            },
            body: JSON.stringify({
              cart: {
                cartRef: {
                  id: `${cart?.id}`,
                },
              },
              metadata: {
                applicationKey: "demo-commercetools-checkout-taxes",
                futureOrderNumber: generateOrderNumber(),
              },
            }),
          }
        );

        const data = await res.json();
        console.log("Checkout session created:", data);

      paymentFlow({
            sessionId: data.id, // ← id returned by step 1
            projectKey: 'sc-docs-poc',
            region: 'australia-southeast1.gcp',

            /* address/ shipping settings are ignored in payment-only mode */

            logInfo: true,
            onInfo: ({ code, payload }) => {
              if (code === 'checkout_completed') {
                router.push(
                  `/order-confirmation?orderId=${(payload as any).order.id}`
                );
              }
            },
          });

      } catch (e) {
        console.error("Failed to parse cookie:", e);
      }
    }
  };

  return (
    <div className="md:mx-auto p-6 flex flex-col gap-10 md:space-x-8 items-center md:flex-row md:gap-0">
      <div className="w-[325px] md:w-full md:min-w-[500px]">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

        <>
          {cart.lineItems.map((item: CartItem) => {
            const discountedPrice =
              item.price?.discounted?.value.centAmount / 100;
            const originalPrice = item.price?.value.centAmount / 100;
            return (
              <div key={item.id}>
                <div className="flex items-center justify-between rounded-md m-2 p-3 hover:bg-gray-100 transition-colors">
                  {item?.image && (
                    <Link href={`/products/${item.id}`}>
                      <Image
                        width={64}
                        height={64}
                        src={item.image}
                        alt={item.name?.["en-US"]}
                        className="w-16 h-16 object-contain rounded-md mr-4 cursor-pointer"
                      />
                    </Link>
                  )}

                  <div className="flex-grow">
                    <p className="mb-4">{item.name?.["en-US"]}</p>
                    <div className="flex items-center">
                      <div className="flex items-start my-2 border border-gray-300 rounded-md shadow-sm w-fit">
                        <button
                          onClick={() => {
                            const newQuantity = Math.max(
                              1,
                              (quantities[item.id] || item.quantity) - 1
                            );
                            handleQuantityChange(item.id, newQuantity);
                            updateCartQuantity(item.id, newQuantity);
                          }}
                          className="w-6 h-7 flex items-center justify-center text-cyan-800 font-bold rounded-l-md hover:bg-gray-200 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          className="w-7 h-7 border-0 text-center focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min={1}
                          value={quantities[item.id] || item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          onBlur={() => handleUpdateQuantity(item.id)}
                        />
                        <button
                          onClick={() => {
                            const newQuantity =
                              (quantities[item.id] || item.quantity) + 1;
                            handleQuantityChange(item.id, newQuantity);
                            updateCartQuantity(item.id, newQuantity);
                          }}
                          className="w-6 h-7 flex items-center justify-center text-cyan-800 font-bold rounded-r-md hover:bg-gray-200 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      {discountedPrice ? (
                        <div className="flex flex-col ml-2">
                          <span className="text-[11px] text-gray-500 line-through">
                            ${originalPrice}
                          </span>
                          <span className="text-xs font-bold text-black">
                            ${discountedPrice} each
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-xs font-bold text-black ml-2">
                            ${originalPrice} each
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-between">
                    <span className="text-lg font-bold text-black mb-4">
                      ${item?.totalPrice?.centAmount / 100}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors cursor-pointer hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="w-full border-b-[0.5px] border-b-gray-400"></div>
              </div>
            );
          })}
          <button
            onClick={clearCart}
            className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow-sm transition-colors"
          >
            Clear Cart
          </button>
        </>
      </div>

      <div className="w-full md:min-w-[300px] p-4 bg-gray-100 rounded-md shadow-md items-start ">
        <h2 className="text-lg font-bold">Order Summary</h2>
        {cart?.totalPrice?.centAmount && (
          <div className="flex justify-between mt-4">
            <span className="text-xl font-bold text-gray-600">Total</span>
            <span className="text-lg font-bold">
              ${(cart?.totalPrice?.centAmount / 100).toFixed(2)}
            </span>
          </div>
        )}

        <button
          className="mt-4 px-6 py-2 bg-cyan-700 text-white rounded w-full cursor-pointer"
          disabled={!cart?.lineItems || cart.lineItems.length < 1}
          onClick={() => router.push("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
