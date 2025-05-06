import { apiRoot, meClient } from "@/lib/ctClient";
import { getExceptionMessage } from "./withExceptionFilter";
import { Cart } from "@commercetools/platform-sdk";

export async function getOrCreateCart(
  anonymousId: string,
  token: string
): Promise<Cart | null> {
  let cart = null;
  try {
    const guestClient = meClient(token);

    const cartResponse = await guestClient.me().activeCart().get().execute();
    cart = cartResponse.body;
  } catch (error: unknown) {
    console.log(getExceptionMessage(error));
  }

  if (!cart && anonymousId) {
    const createResponse = await apiRoot
      .carts()
      .post({
        body: {
          currency: "USD",
          country: "US",
          anonymousId,
        },
      })
      .execute();

    cart = createResponse.body;
  }

  return cart;
}
