"use client";

import React, { Suspense } from "react";
import OrderConfirmationClient from "./order-confirmation";

const OrderConfirmation = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationClient />
    </Suspense>
  );
};

export default OrderConfirmation;
