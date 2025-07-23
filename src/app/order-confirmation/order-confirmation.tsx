"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import TickMarkCircleIcon from "@/icons/TickMarkCircleIcon";
import { OrderConfirmationProps } from "@/types/order-confirmation.types.";

export default function OrderConfirmation({ order }: OrderConfirmationProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timeout);
  }, []);

  const shipping = order.shippingAddress;
  const billing = order.billingAddress;
  const items = order.lineItems;
  const email = order.customerEmail;
  const shippingCost = order.shippingInfo?.price?.centAmount ?? 0;
  const totalPrice = order.totalPrice?.centAmount ?? 0;
  const currency = order.totalPrice?.currencyCode ?? "USD";

  const formatCurrency = (amount: number) =>
    `${currency} ${(amount / 100).toFixed(2)}`;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto my-10 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-40 bg-gray-100 rounded" />
          <div className="h-24 bg-gray-100 rounded" />
          <div className="h-10 bg-gray-300 rounded w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex-1 min-w-0 pr-0 lg:pr-8">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <TickMarkCircleIcon />
          </div>
          <h2 className="text-2xl font-bold">Thank you for your order!</h2>
        </div>
        <p className="mb-1">
          You&apos;ll receive a confirmation email at{" "}
          <span className="font-medium">{email}</span>
        </p>
        <hr className="my-4" />
        <div className="mb-6">
          <div className="mb-2">
            <span className="font-semibold">Order number</span>
            <div>{order.orderNumber ?? order.id}</div>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Shipping address</span>
            <div>
              {shipping?.firstName} {shipping?.lastName}
              <br />
              {shipping?.streetName}, {shipping?.city}, {shipping?.postalCode},{" "}
              {shipping?.country}
            </div>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Shipping method</span>
            <div>{order.shippingInfo?.shippingMethodName ?? "Default"}</div>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Payment status</span>
            <div>{order.paymentState ?? "N/A"}</div>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Billing address</span>
            <div>
              {billing?.firstName} {billing?.lastName}
              <br />
              {billing?.streetName}, {billing?.city}, {billing?.postalCode},{" "}
              {billing?.country}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 flex-shrink-0 mt-8 lg:mt-0">
        <div className="bg-gray-50 rounded-md p-6">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-start mb-4">
              <Image
                src={item.variant.images?.[0]?.url ?? "/fallback.png"}
                alt={item.name?.en ?? "Product"}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded mr-3"
                loading="lazy"
              />
              <div className="flex-1">
                <div className="font-medium">{item.name?.en}</div>
                <div className="text-xs text-gray-500">
                  {item.quantity} ×{" "}
                  <span className="font-semibold text-black">
                    {formatCurrency(item.price.value.centAmount)}
                  </span>
                </div>
                {item.price.discounted && (
                  <div className="text-xs text-green-700 font-medium mt-1">
                    Discount applied
                  </div>
                )}
              </div>
            </div>
          ))}
          <hr className="my-4" />
          <div className="flex justify-between text-sm mb-1">
            <div>Subtotal</div>
            <div>
              {formatCurrency(
                order.taxedPrice?.totalNet.centAmount ?? totalPrice
              )}
            </div>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <div>Shipping</div>
            <div>
              {shippingCost === 0 ? (
                <span className="text-green-700 font-medium">FREE</span>
              ) : (
                formatCurrency(shippingCost)
              )}
            </div>
          </div>
          <div className="flex justify-between font-bold text-xl">
            <div>Total</div>
            <div>{formatCurrency(totalPrice)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
