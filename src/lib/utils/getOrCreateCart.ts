import { apiRoot } from "@/lib/ctClient";
import { Cart } from "@commercetools/platform-sdk";

interface IRetrieveCart {
  anonymousId?: string;
  createCart?: boolean;
  customerId?: string;
}

export async function getOrCreateCart({
  anonymousId,
  customerId,
  createCart = true,
}: IRetrieveCart): Promise<Cart | null> {
  if (!anonymousId && !customerId) return null;

  let cart: Cart | null = null;

  if (customerId) {
    try {
      const cartResponse = await apiRoot
        .carts()
        .withCustomerId({ customerId })
        .get()
        .execute();
      cart = cartResponse.body;
    } catch (error) {
      console.error("Failed to retrieve cart by customerId:", error);
    }
  }

  if (customerId && !cart && createCart) {
    try {
      const createResponse = await apiRoot.carts().post({
        body: {
          currency: "USD",
          country: "US",
          customerId,
        },
      }).execute();
      cart = createResponse.body;
    } catch (error) {
      console.error("Failed to create cart for customerId:", error);
    }
  }

  if (!cart && anonymousId) {
    try {
      const queryResponse = await apiRoot.carts().get({
        queryArgs: {
          where: `anonymousId="${anonymousId}"`,
          sort: "lastModifiedAt desc",
          limit: 1,
        },
      }).execute();
      cart = queryResponse.body.results[0] || null;
    } catch (error) {
      console.error("Failed to retrieve cart by anonymousId:", error);
    }
  }

  if (!cart && anonymousId && createCart) {
    try {
      const createResponse = await apiRoot.carts().post({
        body: {
          currency: "USD",
          country: "US",
          anonymousId,
        },
      }).execute();
      cart = createResponse.body;
    } catch (error) {
      console.error("Failed to create cart for anonymousId:", error);
    }
  }

  return cart;
}
