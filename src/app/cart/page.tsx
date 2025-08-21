"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CartItem } from "@/types/types";
import Cookies from "js-cookie";
import { checkoutFlow } from "@commercetools/checkout-browser-sdk";
import { useRouter } from "next/navigation";
import { DEFAULT_BLUR_DATA_URL } from "@/constants";
import ImagePlaceholderIcon from "@/icons/ImagePlaceholderIcon";
import SpinnerIcon from "@/icons/SpinnerIcon";
import TrashIcon from "@/icons/TrashIcon";
import { CheckoutSuccessLoader } from "@/components/CheckoutSuccessLoader";
import SupportIcon from "@/icons/SupportIcon";
import ReturnPolicyIcon from "@/icons/ReturnPolicyIcon";
import SecureIcon from "@/icons/SecureIcon";
import CheckoutIcon from "@/icons/CheckoutIcon";
import ShippingInfoIcon from "@/icons/ShippingInfoIcon";

function generateOrderNumber() {
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestampPart = Date.now().toString(36).slice(-2).toUpperCase();
  return `ORD-${timestampPart}${randomPart}`;
}

const DISCOUNT_CODES: Record<
  string,
  { type: "percentage" | "fixed"; value: number; description: string }
> = {
  SAVE10: { type: "percentage", value: 10, description: "10% off" },
  WELCOME20: { type: "percentage", value: 20, description: "20% off" },
  FIXED5: { type: "fixed", value: 5, description: "$5 off" },
  SUMMER25: { type: "percentage", value: 25, description: "25% off" },
};

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    clearCart,
    updateCartQuantity,
    isLoading,
    refreshCart,
  } = useCart();
  const router = useRouter();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showSuccessLoader, setShowSuccessLoader] = useState(false);
  const [isFetchingCart, setIsFetchingCart] = useState(false);

  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    type: "percentage" | "fixed";
    value: number;
    description: string;
  } | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  useEffect(() => {
    const fetchCartData = async () => {
      setIsFetchingCart(true);
      try {
        const response = await fetch("/api/cart", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const cartData = await response.json();
          console.log("Fresh cart data fetched:", cartData);

          if (typeof refreshCart === "function") {
            await refreshCart();
          }
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setIsFetchingCart(false);
      }
    };

    const needsFetch = !cart?.lineItems?.some(
      (item) => item.image || item.variant?.images?.[0]?.url
    );
    if (needsFetch) {
      fetchCartData();
    }
  }, []);

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

  const handleRemoveItem = async (id: string) => {
    setRemovingItems((prev) => new Set([...prev, id]));
    await removeFromCart(id);
    setRemovingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError("Please enter a discount code");
      return;
    }

    setIsApplyingDiscount(true);
    setDiscountError("");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const discount =
      DISCOUNT_CODES[discountCode.toUpperCase() as keyof typeof DISCOUNT_CODES];

    if (discount) {
      setAppliedDiscount({
        code: discountCode.toUpperCase(),
        ...discount,
      });
      setDiscountCode("");
      setDiscountError("");
    } else {
      setDiscountError("Invalid discount code");
    }

    setIsApplyingDiscount(false);
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountError("");
  };

  const handleDiscountKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApplyDiscount();
    }
  };

  if (isLoading || isFetchingCart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-lg text-gray-600 font-medium">
            Loading your cart...
          </p>
        </div>
      </div>
    );
  }

  if (!cart?.lineItems || cart.lineItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven&#39;t added anything to your cart yet.
          </p>
          <Link href="/">
            <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              <span>Continue Shopping</span>
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const startCheckoutFlow = async () => {
    setIsCheckingOut(true);
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

        checkoutFlow({
          sessionId: data.id,
          projectKey: "sc-docs-poc",
          region: "australia-southeast1.gcp",
          logInfo: true,
          logWarn: true,
          logError: true,

          onInfo: (message) => {
            if (message.code === "checkout_completed") {
              const {
                order: { id },
              } = message.payload as {
                order: { id: string };
              };

              setShowSuccessLoader(true);

              setTimeout(() => {
                router.push(`/order-confirmation?orderId=${id}`);
              }, 1500);
            }
          },
        });
      } catch (e) {
        console.error("Failed to parse cookie:", e);
        setIsCheckingOut(false);
      }
    } else {
      setIsCheckingOut(false);
    }
  };

  const subtotal = (cart?.totalPrice?.centAmount ?? 0) / 100;
  const shipping = subtotal > 50 ? 0 : 9.99;

  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === "percentage") {
      discountAmount = subtotal * (appliedDiscount.value / 100);
    } else {
      discountAmount = appliedDiscount.value;
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const finalTax = discountedSubtotal * 0.08;
  const finalShipping = discountedSubtotal > 50 ? 0 : shipping;
  const total = discountedSubtotal + finalShipping + finalTax;


  return (
    <>
      {showSuccessLoader && <CheckoutSuccessLoader />}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600">
              {cart.lineItems.length}{" "}
              {cart.lineItems.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {cart.lineItems.map((item: CartItem, index) => {
                  const discountedPrice =
                    item.price?.discounted?.value.centAmount / 100;
                  const originalPrice = item.price?.value.centAmount / 100;
                  const isRemoving = removingItems.has(item.id);

                  const itemImage =
                    item?.image || item?.variant?.images?.[0]?.url;
                  const itemName =
                    item.name?.["en-US"] || item.name?.["en"] || "Product";

                  return (
                    <div key={item.id}>
                      <div
                        className={`p-3 md:p-6 transition-all duration-300 ${
                          isRemoving
                            ? "opacity-50 scale-95"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="block md:hidden">
                          <div className="flex items-start space-x-3 mb-3">
                            {itemImage ? (
                              <Link href={`/products/${item.id}`}>
                                <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-lg border border-gray-200 overflow-hidden group cursor-pointer">
                                  <Image
                                    width={64}
                                    height={64}
                                    src={itemImage}
                                    alt={itemName}
                                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                                    placeholder="blur"
                                    blurDataURL={DEFAULT_BLUR_DATA_URL}
                                  />
                                </div>
                              </Link>
                            ) : (
                              <div className="relative w-16 h-16 flex-shrink-0 bg-gray-200 rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImagePlaceholderIcon />
                                </div>
                              </div>
                            )}
                            <div className="flex-grow min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                                {itemName}
                              </h3>
                              <div className="flex items-center space-x-2 mb-2">
                                {discountedPrice ? (
                                  <>
                                    <span className="text-xs text-gray-500 line-through">
                                      ${originalPrice?.toFixed(2)}
                                    </span>
                                    <span className="text-sm font-bold text-indigo-600">
                                      ${discountedPrice.toFixed(2)}
                                    </span>
                                    <span className="bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                      Sale
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-sm font-bold text-gray-900">
                                    ${originalPrice?.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-lg font-bold text-gray-900">
                                $
                                {(item?.totalPrice?.centAmount / 100)?.toFixed(
                                  2
                                )}
                              </p>
                              <p className="text-xs text-gray-500">Total</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                                <button
                                  onClick={() => {
                                    const newQuantity = Math.max(
                                      1,
                                      (quantities[item.id] || item.quantity) - 1
                                    );
                                    handleQuantityChange(item.id, newQuantity);
                                    updateCartQuantity(item.id, newQuantity);
                                  }}
                                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-indigo-600 active:bg-gray-200 transition-colors font-semibold text-lg touch-manipulation"
                                  disabled={isRemoving}
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  className="w-12 h-8 border-0 text-center focus:ring-0 focus:outline-none font-semibold text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  min={1}
                                  value={quantities[item.id] || item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.id,
                                      parseInt(e.target.value) || 1
                                    )
                                  }
                                  onBlur={() => handleUpdateQuantity(item.id)}
                                  disabled={isRemoving}
                                />
                                <button
                                  onClick={() => {
                                    const newQuantity =
                                      (quantities[item.id] || item.quantity) +
                                      1;
                                    handleQuantityChange(item.id, newQuantity);
                                    updateCartQuantity(item.id, newQuantity);
                                  }}
                                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-indigo-600 active:bg-gray-200 transition-colors font-semibold text-lg touch-manipulation"
                                  disabled={isRemoving}
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-xs text-gray-500">
                                × each
                              </span>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isRemoving}
                              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-all duration-200 disabled:opacity-50"
                            >
                              {isRemoving ? (
                                <>
                                  <SpinnerIcon />
                                  <span className="text-xs font-medium">
                                    Removing...
                                  </span>
                                </>
                              ) : (
                                <>
                                  <TrashIcon />
                                  <span className="text-xs font-medium">
                                    Remove
                                  </span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="hidden md:flex items-center space-x-6">
                          {itemImage && (
                            <Link href={`/products/${item.id}`}>
                              <div className="relative w-24 h-[124px] flex-shrink-0 bg-white rounded-xl border border-gray-200 overflow-hidden group cursor-pointer">
                                <Image
                                  width={96}
                                  height={96}
                                  src={itemImage}
                                  alt={itemName}
                                  className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                            </Link>
                          )}

                          <div className="flex-grow min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                              {itemName}
                            </h3>

                            <div className="flex items-center space-x-2 mb-4">
                              {discountedPrice ? (
                                <>
                                  <span className="text-sm text-gray-500 line-through">
                                    ${originalPrice?.toFixed(2)}
                                  </span>
                                  <span className="text-lg font-bold text-indigo-600">
                                    ${discountedPrice.toFixed(2)}
                                  </span>
                                  <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                                    Sale
                                  </span>
                                </>
                              ) : (
                                <span className="text-lg font-bold text-gray-900">
                                  ${originalPrice?.toFixed(2)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-4">
                              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                <button
                                  onClick={() => {
                                    const newQuantity = Math.max(
                                      1,
                                      (quantities[item.id] || item.quantity) - 1
                                    );
                                    handleQuantityChange(item.id, newQuantity);
                                    updateCartQuantity(item.id, newQuantity);
                                  }}
                                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-indigo-600 active:bg-gray-200 transition-colors font-semibold text-xl touch-manipulation"
                                  disabled={isRemoving}
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  className="w-16 h-10 border-0 text-center focus:ring-0 focus:outline-none font-semibold text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  min={1}
                                  value={quantities[item.id] || item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.id,
                                      parseInt(e.target.value) || 1
                                    )
                                  }
                                  onBlur={() => handleUpdateQuantity(item.id)}
                                  disabled={isRemoving}
                                />
                                <button
                                  onClick={() => {
                                    const newQuantity =
                                      (quantities[item.id] || item.quantity) +
                                      1;
                                    handleQuantityChange(item.id, newQuantity);
                                    updateCartQuantity(item.id, newQuantity);
                                  }}
                                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-indigo-600 active:bg-gray-200 transition-colors font-semibold text-xl touch-manipulation"
                                  disabled={isRemoving}
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-sm text-gray-500 whitespace-nowrap">
                                × each
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end space-y-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">
                                $
                                {(item?.totalPrice?.centAmount / 100)?.toFixed(
                                  2
                                )}
                              </p>
                              <p className="text-sm text-gray-500">Total</p>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isRemoving}
                              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
                            >
                              {isRemoving ? (
                                <>
                                  <svg
                                    className="w-4 h-4 animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                  </svg>
                                  <span className="text-sm font-medium">
                                    Removing...
                                  </span>
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  <span className="text-sm font-medium">
                                    Remove
                                  </span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      {index < (cart.lineItems?.length ?? 0) - 1 && (
                        <div className="border-b border-gray-100"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-start">
                <button
                  onClick={clearCart}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl border border-red-200 hover:border-red-300 transition-all duration-200"
                >
                  <TrashIcon />
                  <span className="font-medium">Clear Cart</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Code
                  </label>
                  {appliedDiscount ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="font-medium text-green-900">
                              {appliedDiscount.code}
                            </span>
                          </div>
                          <p className="text-sm text-green-700">
                            {appliedDiscount.description} applied
                          </p>
                        </div>
                        <button
                          onClick={handleRemoveDiscount}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          onKeyPress={handleDiscountKeyPress}
                          placeholder="Enter discount code"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          disabled={isApplyingDiscount}
                        />
                        <button
                          onClick={handleApplyDiscount}
                          disabled={isApplyingDiscount || !discountCode.trim()}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                          {isApplyingDiscount ? (
                            <div className="flex items-center space-x-1">
                              <svg
                                className="w-4 h-4 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              <span>Applying</span>
                            </div>
                          ) : (
                            "Apply"
                          )}
                        </button>
                      </div>
                      {discountError && (
                        <p className="text-red-600 text-sm flex items-center space-x-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{discountError}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.lineItems.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {appliedDiscount && discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedDiscount.code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <div className="text-right">
                      {finalShipping === 0 ? (
                        <div>
                          <span className="text-green-600 font-medium">
                            FREE
                          </span>
                          <p className="text-xs text-green-600">
                            Orders over $50
                          </p>
                        </div>
                      ) : (
                        <span>${finalShipping.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${finalTax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    {appliedDiscount && (
                      <p className="text-sm text-green-600 mt-1">
                        You saved ${discountAmount.toFixed(2)}!
                      </p>
                    )}
                  </div>
                </div>

                {discountedSubtotal < 50 && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <ShippingInfoIcon />
                      <span className="text-sm font-medium text-blue-900">
                        Add ${(50 - discountedSubtotal).toFixed(2)} more for
                        FREE shipping!
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(discountedSubtotal / 50) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <button
                  onClick={startCheckoutFlow}
                  disabled={
                    !cart?.lineItems ||
                    cart.lineItems.length < 1 ||
                    isCheckingOut ||
                    showSuccessLoader
                  }
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md"
                >
                  {isCheckingOut ? (
                    <div className="flex items-center justify-center space-x-2">
                      <SpinnerIcon />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <CheckoutIcon />
                      <span>Proceed to Checkout</span>
                    </div>
                  )}
                </button>

                <div className="grid grid-cols-1 gap-3 mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <SecureIcon />
                    <span>Secure SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <ReturnPolicyIcon />
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <SupportIcon />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
