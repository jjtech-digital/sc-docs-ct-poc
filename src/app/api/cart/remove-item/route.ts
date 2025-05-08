import { NextRequest, NextResponse } from "next/server";
import { apiRoot } from "@/lib/ctClient";
import { ApiError } from "next/dist/server/api-utils";
import { getOrCreateCart } from "@/lib/utils/getOrCreateCart";

import { withExceptionFilter } from "@/lib/utils/withExceptionFilter";
import { getAllCookie } from "@/lib/utils/getAllCookie";
import { parseJSON } from "@/lib/utils/helpers";
import { User } from "@/types/types.be";

async function handler(req: NextRequest): Promise<NextResponse> {
  const { lineItemId } = await req.json();
  if (!lineItemId) throw new ApiError(400, "lineItemId is required");
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
            action: "removeLineItem",
            lineItemId,
          },
        ],
      },
    })
    .execute();

  return NextResponse.json({ cart: updatedCart.body });
}

export const POST = withExceptionFilter(handler);
