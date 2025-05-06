const projectKey = process.env.CT_PROJECT_KEY!;
const clientId = process.env.CT_CLIENT_ID!;
const clientSecret = process.env.CT_CLIENT_SECRET!;
const authUrl = process.env.CT_AUTH_URL!;

export const createAnonymousUser = async () => {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const body = new URLSearchParams({
    grant_type: "client_credentials",
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

  if (!res.ok) {
    const error = await res.json();
    console.log(error);
    throw new Error(`Failed to create anonymous user: ${error}`);
  }

  const data = await res.json();
  console.log("Anonymous user created:", data);
  return data;
};
