import { apiRoot } from "@/lib/ctClient";
import { NextRequest, NextResponse } from "next/server";
import { getOrCreateCart } from "@/lib/utils/getOrCreateCart";
import { ApiError } from "next/dist/server/api-utils";
import { withExceptionFilter } from "@/lib/utils/withExceptionFilter";
import { getAllCookie } from "@/lib/utils/getAllCookie";
import { User } from "@/types/types.be";
import { parseJSON } from "@/lib/utils/helpers";

async function handler(req: NextRequest): Promise<NextResponse> {
  try {
    const cookies = await getAllCookie();
    const user = parseJSON(cookies.user, {}) as User;

    const { productId, variantId, quantity } = await req.json();

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
