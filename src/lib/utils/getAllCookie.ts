import { cookies } from "next/headers";
import { createAnonymousUser } from "@/lib/utils/createAnonymousUser";

const SLIDING_EXPIRATION_SECONDS = 60 * 60 * 24 * 30;

export const getAllCookie = async () => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const cookiez = allCookies.reduce((acc, cookie) => {
    acc[cookie.name] = cookie.value;
    return acc;
  }, {} as Record<string, string>);

  if (!cookiez.token) {
    const anonymousUser = await createAnonymousUser();
    cookieStore.set("user", JSON.stringify(anonymousUser), {
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: SLIDING_EXPIRATION_SECONDS,
    });
  }

  return cookiez;
};
