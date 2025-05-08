import { cookies } from "next/headers";

const SLIDING_EXPIRATION_SECONDS = 60 * 60 * 24 * 20;

export async function getOrRefreshCookie(
  key: string,
  fallbackValue?: string,
  options?: {
    httpOnly?: boolean;
    path?: string;
    sameSite?: "lax" | "strict" | "none";
    maxAge?: number;
  }
): Promise<string | undefined> {
  const cookieStore = cookies();
  const value = (await cookieStore).get(key)?.value ?? fallbackValue;

  if (value) {
    (await cookieStore).set(key, value, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: SLIDING_EXPIRATION_SECONDS,
      ...options,
    });
  }

  return value;
}
