import { apiRoot } from "@/lib/ctClient";
import { NextRequest, NextResponse } from "next/server";
import { getOrCreateCart } from "@/lib/utils/getOrCreateCart";
import { ApiError } from "next/dist/server/api-utils";
import { withExceptionFilter } from "@/lib/utils/withExceptionFilter";
import { getOrRefreshCookie } from "@/lib/utils/getOrRefreshCookie";
import { v4 as uuidv4 } from "uuid";
import { getAllCookie } from "@/lib/utils/getAllCookie";

async function handler(req: NextRequest): Promise<NextResponse> {
  try {
    const cartId = await getOrRefreshCookie("cartId");
    const anonymousId = await getOrRefreshCookie("anonymousId", uuidv4());
    await getAllCookie();

    const { productId, variantId, quantity } = await req.json();

    const cart = await getOrCreateCart(anonymousId, cartId);

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
              action: "addLineItem",
              productId,
              variantId,
              quantity,
            },
          ],
        },
      })
      .execute();

    return NextResponse.json({ cart: updatedCart.body });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "An error occurred while adding the item to the cart." },
      { status: 500 }
    );
  }
}

export const POST = withExceptionFilter(handler);
