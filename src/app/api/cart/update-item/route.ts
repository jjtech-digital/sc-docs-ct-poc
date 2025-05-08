import { apiRoot } from "@/lib/ctClient";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "next/dist/server/api-utils";
import { getOrCreateCart } from "@/lib/utils/getOrCreateCart";

import { withExceptionFilter } from "@/lib/utils/withExceptionFilter";
import { getAllCookie } from "@/lib/utils/getAllCookie";
import { User } from "@/types/types.be";
import { parseJSON } from "@/lib/utils/helpers";

async function handler(req: NextRequest): Promise<NextResponse> {
  const { lineItemId, quantity } = await req.json();
  if (!lineItemId || quantity === undefined) {
    throw new ApiError(400, "lineItemId and quantity are required");
  }
  const cookies = await getAllCookie();
  const user = parseJSON(cookies.user, {}) as User;

  const cart = await getOrCreateCart({
    anonymousId: user?.anonymousId,
    customerId: user?.customerId,
  });

  if (!cart) {
    throw new ApiError(400, "Unable to create or retrieve cart.");
  }

  const updatedCart = await apiRoot
    .carts()
    .withId({ ID: cart.id })
    .post({
      body: {
        version: cart.version,
        actions: [
          {
            action: "changeLineItemQuantity",
            lineItemId,
            quantity,
          },
        ],
      },
    })
    .execute();

  return NextResponse.json({ cart: updatedCart.body });
}

export const POST = withExceptionFilter(handler);
