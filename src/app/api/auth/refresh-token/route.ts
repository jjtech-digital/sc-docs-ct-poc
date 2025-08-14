import { apiRoot } from "@/lib/ctClient";
import { NextRequest, NextResponse } from "next/server";
import { withExceptionFilter } from "@/lib/utils/withExceptionFilter";
import { cookies } from "next/headers";

const projectKey = process.env.CT_PROJECT_KEY!;
const clientId = process.env.CT_CLIENT_ID!;
const clientSecret = process.env.CT_CLIENT_SECRET!;
const authUrl = process.env.CT_AUTH_URL!;

const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
  "base64"
);

const SLIDING_EXPIRATION_SECONDS = 60 * 60 * 24 * 20;

async function handler(req: NextRequest): Promise<NextResponse> {
  try {
    const reqbody = await req.json();
    const cookieStore = await cookies();
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      scope: `${process.env.CT_SCOPE}:${projectKey}`,
    });

    const res = await fetch(`${authUrl}/oauth/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Failed to refresh token: ${data.error_description}`);
    }

    cookieStore.set(
      "user",
      JSON.stringify({ ...data, refresh_token: reqbody.refreshToken }),
      {
        secure: true,
        path: "/",
        sameSite: "lax",
        maxAge: SLIDING_EXPIRATION_SECONDS,
      }
    );

    return NextResponse.json(
      {
        access_token: data.access_token,
        token_type: data.token_type,
        expires_in: data.expires_in,
        scope: data.scope,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching products:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching products." },
      { status: 500 }
    );
  }
}

export const POST = withExceptionFilter(handler);
