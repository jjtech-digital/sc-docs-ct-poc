import { meClient } from "@/lib/ctClient";
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

  const mClient = meClient(token);
  if (!mClient) {
    throw new Error(
      "Invalid or missing token; cannot create commercetools client"
    );
  }

  try {
    // Try to get the active cart
    const cartResponse = await mClient.me().activeCart().get().execute();
    if (!cartResponse.body) {
      // No active cart, create one
      const createResponse = await mClient
        .me()
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
      return createResponse.body ?? null;
    }
    return cartResponse.body;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      (error as { statusCode?: number }).statusCode === 404
    ) {
      // Active cart not found, create one
      const createResponse = await mClient
        .me()
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
      return createResponse.body ?? null;
    }
    console.error("Error in getOrCreateCart:", error);
    throw error;
  }
}
