import { NextResponse } from "next/server";
import { apiRoot } from "@/lib/ctClient";
import { ApiError } from "next/dist/server/api-utils";
import { getOrRefreshCookie } from "@/lib/utils/getOrRefreshCookie";
import { getOrCreateCart } from "@/lib/utils/getOrCreateCart";

import { withExceptionFilter } from "@/lib/utils/withExceptionFilter";
import { CartUpdateAction } from "@commercetools/platform-sdk";
import { getAllCookie } from "@/lib/utils/getAllCookie";

async function handler(): Promise<NextResponse> {
  let cartId = await getOrRefreshCookie("cartId");
  const cookies = await getAllCookie();
  const user = JSON.parse(cookies.user);
  const anonymousId = user.anonymousId;

  const cart = await getOrCreateCart(anonymousId, user.access_token);
  if (!cart) {
    throw new ApiError(400, "Unable to create or retrieve cart.");
  }
  cartId = cart.id;
  await getOrRefreshCookie("cartId", cart.id);

  const clearCartActions: CartUpdateAction[] = cart.lineItems.map(
    (lineItem) => ({
      action: "removeLineItem" as const,
      lineItemId: lineItem.id,
    })
  );

  if (clearCartActions.length === 0) {
    return NextResponse.json({ cart });
  }

  const updatedCart = await apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: cart.version,
        actions: clearCartActions,
      },
    })
    .execute();

  return NextResponse.json({ cart: updatedCart.body });
}

export const POST = withExceptionFilter(handler);
