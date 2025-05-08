import { z } from "zod";
import { apiRoot } from "@/lib/ctClient";
import { NextRequest, NextResponse } from "next/server";
import { getOrCreateCart } from "@/lib/utils/getOrCreateCart";
import { withExceptionFilter } from "@/lib/utils/withExceptionFilter";
import { getAllCookie } from "@/lib/utils/getAllCookie";
import { CustomerSignin } from "@commercetools/platform-sdk";
import { ApiError } from "next/dist/server/api-utils";
import { createLoggedInUser } from "@/lib/utils/createLoggedInUser";
import { getOrRefreshCookie } from "@/lib/utils/getOrRefreshCookie";
import { User } from "@/types/types.be";
import { parseJSON } from "@/lib/utils/helpers";

const customerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Invalid password format"),
});

async function handler(req: NextRequest): Promise<NextResponse> {
  const cookies = await getAllCookie(true);
  const user = parseJSON(cookies.user, {}) as User;

  const cart = await getOrCreateCart({
    anonymousId: user?.anonymousId,
    createCart: false,
  });

  const body = await req.json();

  const parsed = customerSchema.safeParse(body);

  if (!parsed.success) {
    throw new ApiError(400, "Zod validation error");
  }

  const { email, password } = parsed.data;

  let customerSignInData: CustomerSignin;

  if (cart?.id) {
    customerSignInData = {
      email,
      password,
      anonymousCart: { id: cart.id, typeId: "cart" },
    };
  } else {
    customerSignInData = { email, password };
  }

  const customer = await apiRoot
    .login()
    .post({ body: customerSignInData })
    .execute();

  if (customer.body.customer.id) {
    const userData = await createLoggedInUser({ email, password });
    await getOrRefreshCookie("user", JSON.stringify(userData));
  }

  return NextResponse.json({ user: customer.body.customer });
}

export const POST = withExceptionFilter(handler);
