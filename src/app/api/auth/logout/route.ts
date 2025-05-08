import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { withExceptionFilter } from "@/lib/utils/withExceptionFilter";

async function handler(): Promise<NextResponse> {
  const cookieStore = cookies();
  
  // Clear all authentication-related cookies
  (await cookieStore).set('user', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0, // Setting maxAge to 0 effectively deletes the cookie
  });
  
  (await cookieStore).set('anonymousId', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  
  return NextResponse.json({ success: true });
}

export const POST = withExceptionFilter(handler);