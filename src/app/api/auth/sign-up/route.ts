import { z } from "zod";
import { apiRoot } from "@/lib/ctClient";
import { NextRequest, NextResponse } from "next/server";
import { getOrCreateCart } from "@/lib/utils/getOrCreateCart";
import { withExceptionFilter } from "@/lib/utils/withExceptionFilter";
import { getAllCookie } from "@/lib/utils/getAllCookie";
import { CustomerDraft } from "@commercetools/platform-sdk";
import { ApiError } from "next/dist/server/api-utils";
import { createLoggedInUser } from "@/lib/utils/createLoggedInUser";
import { getOrRefreshCookie } from "@/lib/utils/getOrRefreshCookie";
import { parseJSON } from "@/lib/utils/helpers";
import { User } from "@/types/types.be";

const customerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
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

  const { email, password, firstName, lastName } = parsed.data;

  let customerRawData: CustomerDraft;

  if (cart?.id) {
    customerRawData = {
      email,
      password,
      firstName,
      lastName,
      anonymousCart: { id: cart.id, typeId: "cart" },
    };
  } else {
    customerRawData = { email, password, firstName, lastName };
  }

  const customer = await apiRoot
    .customers()
    .post({ body: customerRawData })
    .execute();

  if (customer.body.customer.id) {
    const userData = await createLoggedInUser({ email, password });
    await getOrRefreshCookie("user", JSON.stringify(userData));
  }

  return NextResponse.json({ user: customer.body.customer });
}

export const POST = withExceptionFilter(handler);
