import { NextRequest, NextResponse } from "next/server";
import { apiRoot } from "@/lib/ctClient";
import { ApiError } from "next/dist/server/api-utils";
import { getOrRefreshCookie } from "@/lib/utils/getOrRefreshCookie";
import { getOrCreateCart } from "@/lib/utils/getOrCreateCart";

import { withExceptionFilter } from "@/lib/utils/withExceptionFilter";
import { getAllCookie } from "@/lib/utils/getAllCookie";

async function handler(req: NextRequest): Promise<NextResponse> {
  const { lineItemId } = await req.json();
  const cookies = await getAllCookie();
  const user = JSON.parse(cookies.user);
  const anonymousId = user.anonymousId;

  const cart = await getOrCreateCart(anonymousId, user.access_token);
  if (!cart) {
    throw new ApiError(400, "Unable to create or retrieve cart.");
  }
  await getOrRefreshCookie("cartId", cart.id);

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
