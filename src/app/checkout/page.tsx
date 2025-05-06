"use client";
import {  useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { emptyCart } from "@/lib/utils/constants";
import { Cart } from "@/types/types";

type ShippingInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetNo: string;
  streetName: string;
  city: string;
  state: string;
  postalCode: string;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart>({ ...emptyCart });
  const { getCart } = useCart();

  useEffect(() => {
    const fetchCart = async () => {
      const cartData = await getCart();
      setCart(cartData);
    };

    fetchCart();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingInfo>();

  const onSubmit = (data: ShippingInfo) => {
    console.log("Submitted shipping data:", data);
    alert("Order placed successfully!");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Shipping Information</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium">First Name</label>
              <input
                {...register("firstName", {
                  required: "First name is required",
                })}
                className="w-full px-3 py-2 border rounded"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium">Last Name</label>
              <input
                {...register("lastName", { required: "Last name is required" })}
                className="w-full px-3 py-2 border rounded"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full px-3 py-2 border rounded"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                {...register("phone", { required: "Phone number is required" })}
                className="w-full px-3 py-2 border rounded"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="block text-sm font-medium">Street No</label>
              <input
                {...register("streetNo", {
                  required: "Street number is required",
                })}
                className="w-full px-3 py-2 border rounded"
              />
              {errors.streetNo && (
                <p className="text-red-500 text-sm">
                  {errors.streetNo.message}
                </p>
              )}
            </div>
            <div className="w-2/3">
              <label className="block text-sm font-medium">Street Name</label>
              <input
                {...register("streetName", {
                  required: "Street name is required",
                })}
                className="w-full px-3 py-2 border rounded"
              />
              {errors.streetName && (
                <p className="text-red-500 text-sm">
                  {errors.streetName.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium">City</label>
              <input
                {...register("city", { required: "City is required" })}
                className="w-full px-3 py-2 border rounded"
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>
            <div className="w-1/4">
              <label className="block text-sm font-medium">State</label>
              <input
                {...register("state", { required: "State is required" })}
                className="w-full px-3 py-2 border rounded"
              />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state.message}</p>
              )}
            </div>
            <div className="w-1/4">
              <label className="block text-sm font-medium">Postal Code</label>
              <input
                {...register("postalCode", {
                  required: "Postal code is required",
                })}
                className="w-full px-3 py-2 border rounded"
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm">
                  {errors.postalCode.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-2 bg-cyan-700 text-white rounded"
          >
            Place Order with stripe
          </button>
        </form>
      </div>

      <div className="bg-gray-100 p-6 rounded-md shadow-md h-fit">
        <h2 className="text-lg font-bold mb-4">Order Summary</h2>
        <div className="space-y-4 border-b pb-4">
          {cart?.lineItems?.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center">
                {item?.image && (
                  <Image
                    width={64}
                    height={64}
                    src={item?.image}
                    alt={item?.name?.["en-US"]}
                    className="object-cover rounded-md mr-4"
                  />
                )}

                <div>
                  <p className="font-bold text-md">{item.name?.["en-US"]}</p>
                  <p className="text-sm text-gray-800">
                    {item.quantity} x $
                    {(
                      (item?.price?.discounted?.value?.centAmount ??
                        item?.price?.value?.centAmount) / 100
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
              {item?.totalPrice?.centAmount && 
               <span className="font-bold">
               ${(item.totalPrice.centAmount / 100).toFixed(2)}
             </span>}
             
            </div>
          ))}
        </div>
        {cart?.totalPrice && (
          <div className="mt-6 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${(cart?.totalPrice?.centAmount / 100).toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
