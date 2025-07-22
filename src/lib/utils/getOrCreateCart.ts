import { apiRoot, meClient } from "@/lib/ctClient";
import { Cart } from "@commercetools/platform-sdk";

interface IRetrieveCart {
  anonymousId?: string;
  customerId?: string;
  token: string;
}

export async function getOrCreateCart({
  anonymousId,
  customerId,
  token,
}: IRetrieveCart): Promise<Cart | null> {
  if (!anonymousId && !customerId) return null;

  let cart: Cart | null = null;

  try {
    const mClient = meClient(token as string);
    const cartResponse = await mClient.me().activeCart().get().execute();
    cart = cartResponse.body;
  } catch (err) {
    console.log("Failed to retrieve cart:", err);
    const createResponse = await apiRoot
      .carts()
      .post({
        body: {
          currency: "AUD",
          country: "AU",
          ...(anonymousId ? { anonymousId } : {}),
          ...(customerId ? { customerId } : {}),
        },
      })
      .execute();
    cart = createResponse.body;
  }

  return cart;
}
