import { cookies } from "next/headers";
import { createAnonymousUser } from "@/lib/utils/createAnonymousUser";

const SLIDING_EXPIRATION_SECONDS = 60 * 60 * 24 * 20;

export const getAllCookie = async (skipCreation: boolean = false) => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const cookiez = allCookies.reduce((acc, cookie) => {
    acc[cookie.name] = cookie.value;
    return acc;
  }, {} as Record<string, string>);

  if (!cookiez.user && !skipCreation) {
    const anonymousUser = await createAnonymousUser();
    cookieStore.set("user", JSON.stringify(anonymousUser), {
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: SLIDING_EXPIRATION_SECONDS,
    });

    cookiez.user = JSON.stringify(anonymousUser);
  }

  return cookiez;
};
