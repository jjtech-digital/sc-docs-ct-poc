"use client";

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TickMarkCircleIcon from '@/icons/TickMarkCircleIcon';
import BackArrowIcon from '@/icons/BackArrowIcon';

const ThankYou = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
         <TickMarkCircleIcon />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Thank You for Your Order!</h1>
        <p className="text-gray-600">Your order has been received and is being processed.</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-md mb-6">
        <div className="flex justify-between mb-4">
          {orderId && (
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{orderId}</p>
            </div>
          )}
        </div>
        
      </div>

      <div className="flex flex-col items-center">
        <p className="text-gray-700 mb-4">{"We're preparing your items with care. Thank you for shopping with us!"}</p>
        <Link href="/">
          <button className="px-6 py-3 bg-black text-white rounded border hover:bg-white hover:text-black hover:border hover:border-black transition cursor-pointer font-semibold flex items-center">
            <BackArrowIcon />
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;