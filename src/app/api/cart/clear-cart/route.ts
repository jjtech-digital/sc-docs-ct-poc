import { NextResponse } from "next/server";
import { apiRoot } from "@/lib/ctClient";
import { ApiError } from "next/dist/server/api-utils";
import { getOrCreateCart } from "@/lib/utils/getOrCreateCart";
import { withExceptionFilter } from "@/lib/utils/withExceptionFilter";
import { CartUpdateAction } from "@commercetools/platform-sdk";
import { getAllCookie } from "@/lib/utils/getAllCookie";
import { User } from "@/types/types.be";
import { parseJSON } from "@/lib/utils/helpers";

async function handler(): Promise<NextResponse> {
  const cookies = await getAllCookie();
  const user = parseJSON(cookies.user, {}) as User;
  const cart = await getOrCreateCart({
    anonymousId: user?.anonymousId,
    customerId: user?.customerId,
  });

  if (!cart) {
    throw new ApiError(400, "Unable to create or retrieve cart.");
  }

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
    .withId({ ID: cart.id })
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
