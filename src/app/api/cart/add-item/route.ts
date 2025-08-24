import { apiRoot } from "@/lib/ctClient";
import { NextRequest, NextResponse } from "next/server";
import { getOrCreateCart } from "@/lib/utils/getOrCreateCart";
import { ApiError } from "next/dist/server/api-utils";
import { withExceptionFilter } from "@/lib/utils/withExceptionFilter";
import { getAllCookie } from "@/lib/utils/getAllCookie";
import { setCookie } from "@/lib/utils/setCookie";
import { createAnonymousUser } from "@/lib/utils/createAnonymousUser";
import { User } from "@/types/types.be";
import { parseJSON } from "@/lib/utils/helpers";

interface ExtendedUser extends User {
  anonymousId?: string;
  cartId?: string;
  cartVersion?: number;
  token_type?: string;
  scope?: string;
}

const TOKEN_BUFFER_TIME = 300;

async function ensureValidToken(
  user: ExtendedUser
): Promise<ExtendedUser | null> {
  try {
    const now = Math.floor(Date.now() / 1000);

    if (
      !user.expires_at ||
      Number(user.expires_at) <= now + TOKEN_BUFFER_TIME
    ) {
      if (!user.refresh_token) {
        console.error("No refresh token available");
        return null;
      }

      const refreshedUser = await refreshToken(user, now);
      return refreshedUser;
    }

    return user;
  } catch (error) {
    console.error("Token validation failed:", error);
    return null;
  }
}

async function refreshToken(
  user: ExtendedUser,
  now: number
): Promise<ExtendedUser | null> {
  try {
    const basicAuth = Buffer.from(
      `${process.env.CT_CLIENT_ID}:${process.env.CT_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch(`${process.env.CT_AUTH_URL}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: user.refresh_token,
        scope: String(process.env.CT_SCOPES || ""),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Token refresh failed:", response.status, errorText);
      return null;
    }

    const tokenData = await response.json();

    return {
      ...user,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token || user.refresh_token,
      expires_at: now + (tokenData.expires_in || 3600),
      token_type: tokenData.token_type || user.token_type,
      scope: tokenData.scope || user.scope,
      cartId: user.cartId,
      cartVersion: user.cartVersion,
    };
  } catch (error) {
    console.error("Token refresh request failed:", error);
    return null;
  }
}

function extractAnonymousId(user: Record<string, unknown>): string | undefined {
  if (typeof user.anonymousId === "string" && user.anonymousId.trim()) {
    return user.anonymousId.trim();
  }

  if (typeof user.scope === "string") {
    const match = user.scope.match(/anonymous_id:([\w-]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }

  for (const [key, value] of Object.entries(user)) {
    if (
      typeof value === "string" &&
      key.toLowerCase().includes("anonymous") &&
      /^[\w-]{8,}$/.test(value)
    ) {
      return value;
    }
  }

  return undefined;
}

function validateAndNormalizeUser(rawUser: unknown): ExtendedUser | null {
  if (!rawUser || typeof rawUser !== "object") {
    return null;
  }

  const anonymousId = extractAnonymousId(rawUser as Record<string, unknown>);

  const userObj = rawUser as Record<string, unknown>;
  if (!userObj.refresh_token || typeof userObj.refresh_token !== "string") {
    return null;
  }

  let access_token =
    typeof userObj.access_token === "string" ? userObj.access_token : undefined;
  if (!access_token && typeof userObj.access_token === "string") {
    access_token = userObj.access_token;
  }

  return {
    ...rawUser,
    anonymousId,
    access_token,
    cartId:
      typeof (rawUser as Record<string, unknown>).cartId === "string"
        ? (rawUser as Record<string, unknown>).cartId
        : undefined,
    cartVersion:
      typeof (rawUser as Record<string, unknown>).cartVersion === "number"
        ? (rawUser as Record<string, unknown>).cartVersion
        : undefined,
  } as ExtendedUser;
}

async function getOrCreateValidUser(
  cookies: Record<string, string>
): Promise<ExtendedUser> {
  try {
    const rawUser = parseJSON(cookies.user, {});
    const normalizedUser = validateAndNormalizeUser(rawUser);

    if (normalizedUser) {
      return normalizedUser;
    }
  } catch (parseError) {
    console.error("Error parsing user cookie:", parseError);
  }

  const newAnonUser = await createAnonymousUser();
  await setCookie("user", JSON.stringify(newAnonUser), {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return newAnonUser;
}

async function getOrCreateCartWithPersistence(
  user: ExtendedUser
): Promise<Cart | null> {
  try {
    if (user.cartId) {
      try {
        const existingCart = await apiRoot
          .carts()
          .withId({ ID: user.cartId })
          .get()
          .execute();

        if (existingCart.body) {
          return existingCart.body as Cart;
        }
      } catch (err) {
        console.error("Failed to retrieve existing cart:", err);
      }
    }

    const cart = await getOrCreateCart({
      anonymousId: user?.anonymousId,
      customerId: user?.customerId,
      token: user.access_token as string,
    });

    return cart as Cart;
  } catch (error) {
    console.error("Cart creation/retrieval failed:", error);
    return null;
  }
}

interface Cart {
  id: string;
  version: number;
}

async function updateUserWithCartInfo(
  user: ExtendedUser,
  cart: Cart
): Promise<void> {
  const updatedUser = {
    ...user,
    cartId: cart.id,
    cartVersion: cart.version,
  };

  await setCookie("user", JSON.stringify(updatedUser), {
    httpOnly: false, // Ensure client-accessible
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

interface AddItemRequestBody {
  productId: string;
  variantId?: string;
  quantity?: number;
}

function validateRequestBody(body: AddItemRequestBody): {
  productId: string;
  variantId?: string;
  quantity: number;
} {
  const { productId, variantId, quantity } = body;

  if (!productId || typeof productId !== "string") {
    throw new Error("Product ID is required and must be a string.");
  }

  const validQuantity =
    typeof quantity === "number" && quantity > 0 ? quantity : 1;

  return {
    productId: productId.trim(),
    variantId:
      variantId && typeof variantId === "string" ? variantId.trim() : undefined,
    quantity: validQuantity,
  };
}

async function handler(req: NextRequest): Promise<NextResponse> {
  try {
    const requestBody = await req.json();
    const { productId, variantId, quantity } = validateRequestBody(requestBody);

    const cookies = await getAllCookie();
    let user = await getOrCreateValidUser(cookies);

    const validUser = await ensureValidToken(user);
    if (!validUser?.access_token) {
      return NextResponse.json(
        { error: "Authentication failed. Unable to refresh token." },
        { status: 401 }
      );
    }

    user = validUser;

    const cart = await getOrCreateCartWithPersistence(user);

    if (!cart) {
      console.error("Failed to get or create cart for user:", {
        anonymousId: user?.anonymousId,
        customerId: user?.customerId,
      });
      throw new ApiError(400, "Unable to create or retrieve cart.");
    }

    await updateUserWithCartInfo(user, cart);

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
              ...(variantId ? { variantId: Number(variantId) } : {}),
              quantity,
            },
          ],
        },
      })
      .execute();

    await updateUserWithCartInfo(user, updatedCart.body);

    return NextResponse.json({
      cart: updatedCart.body,
      message: "Item added to cart successfully",
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const status = errorMessage.includes("Invalid user session") ? 401 : 500;

    return NextResponse.json(
      {
        error: "An error occurred while adding the item to the cart.",
        details: errorMessage,
      },
      { status }
    );
  }
}

export const POST = withExceptionFilter(handler);
