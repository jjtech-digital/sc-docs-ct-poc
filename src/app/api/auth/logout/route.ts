import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { withExceptionFilter } from "@/lib/utils/withExceptionFilter";

async function handler(): Promise<NextResponse> {
  const cookieStore = cookies();

  (await cookieStore).set("user", "", {
    path: "/",
    maxAge: 0,
  });

  (await cookieStore).set("anonymousId", "", {
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ success: true });
}

export const POST = withExceptionFilter(handler);
