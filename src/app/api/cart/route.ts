import { NextResponse } from "next/server";
import { ApiError } from "next/dist/server/api-utils";

import { getOrCreateCart } from "@/lib/utils/getOrCreateCart";
import { withExceptionFilter } from "@/lib/utils/withExceptionFilter";
import { getAllCookie } from "@/lib/utils/getAllCookie";
import { parseJSON } from "@/lib/utils/helpers";
import { User } from "@/types/types.be";

async function handler(): Promise<NextResponse> {
  const cookies = await getAllCookie();
  const user = parseJSON(cookies.user, {}) as User;

  const token = user?.access_token;
  if (!token) {
    throw new ApiError(401, "Unauthorized: Missing access token.");
  }

  const cart = await getOrCreateCart({
    anonymousId: user?.anonymousId,
    customerId: user?.customerId,
    token,
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found.");
  }

  const cartSummary = {
    id: cart.id,
    totalPrice: cart.totalPrice,
    lineItems: (cart.lineItems ?? []).map((item) => ({
      id: item.id,
      name: item.name ?? "Unnamed product",
      quantity: item.quantity ?? 0,
      price: item.price ?? null,
      totalPrice: item.totalPrice ?? null,
      image: item.variant?.images?.[0]?.url ?? null,
    })),
    currency: cart.totalPrice?.currencyCode ?? "AUD",
    anonymousId: user.anonymousId,
  };

  return NextResponse.json({ cart: cartSummary });
}

export const GET = withExceptionFilter(handler);
