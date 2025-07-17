"use client";

import React, { Suspense } from "react";
import { OrderConfirmation as OrderConfirmationClient } from "../../components/order-confirmation";

const OrderConfirmation = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationClient />
    </Suspense>
  );
};

export default OrderConfirmation;
