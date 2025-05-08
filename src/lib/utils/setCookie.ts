import { cookies } from "next/headers";

const SLIDING_EXPIRATION_SECONDS = 60 * 60 * 24 * 20;

export async function setCookie(
  key: string,
  value: string,
  options?: {
    httpOnly?: boolean;
    path?: string;
    sameSite?: "lax" | "strict" | "none";
    maxAge?: number;
  }
): Promise<void> {
  const cookieStore = cookies();
  (await cookieStore).set(key, value, {
    path: "/",
    sameSite: "lax",
    maxAge: SLIDING_EXPIRATION_SECONDS,
    ...options,
  });
}
