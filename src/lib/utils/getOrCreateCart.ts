import { apiRoot } from "@/lib/ctClient";
import { Cart } from "@commercetools/platform-sdk";

interface IRetrieveCart {
  anonymousId?: string,
  createCart?: boolean,
  customerId?: string,
}

export async function getOrCreateCart({ anonymousId, customerId, createCart=true }:IRetrieveCart): Promise<Cart | null> {
  if (!anonymousId && !customerId) return null;
  let cart = null;

  if(customerId){
  const cartResponse = await apiRoot.carts().withCustomerId({ customerId }).get().execute();
  cart = cartResponse.body;
  }

  if(customerId && !cart && createCart){
    const createResponse = await apiRoot.carts().post({
      body: {
        currency: "USD",
        country: "US",
        customerId,
      },
    })
    .execute();
    cart = createResponse.body;
  }

  if (!cart && anonymousId) {
    const queryResponse = await apiRoot
      .carts()
      .get({
        queryArgs: {
          where: `anonymousId="${anonymousId}"`,
          sort: "lastModifiedAt desc",
          limit: 1,
        },
      })
      .execute();

    cart = queryResponse.body.results[0];
  }

  if (!cart && anonymousId && createCart) {
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
