"use client";

import React, { Suspense } from "react";

const OrderConfirmation = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmation />
    </Suspense>
  );
};

export default OrderConfirmation;
