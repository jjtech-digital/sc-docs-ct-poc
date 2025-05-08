const projectKey = process.env.CT_PROJECT_KEY!;
const clientId = process.env.CT_CLIENT_ID!;
const clientSecret = process.env.CT_CLIENT_SECRET!;
const authUrl = process.env.CT_AUTH_URL!;

export const createLoggedInUser = async (userCreds: { email: string; password: string }): Promise<{
    anonymousId: string;
    customerId: string;
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}> => {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
        "base64"
    );

    const body = new URLSearchParams({
        grant_type: "password",
        username: userCreds.email,
        password: userCreds.password,
        scope: `${process.env.CT_SCOPE}:${projectKey}`,
    });

    const res = await fetch(`${authUrl}/oauth/${projectKey}/customers/token`, {
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
        throw new Error(`Failed to create logged in user token: ${error.error_description || error.message}`);
    }

    const data = await res.json();
    console.log("Logged in user created:", data);
    const scopes: string[] = data.scope.split(" ");
    const userScope = scopes.find((scope) =>
        scope.startsWith("customer_id")
    );
    if (!userScope) {
        throw new Error("user scope not found in the response.");
    }
    const customerId = userScope.split(":")[1];
    return {
        customerId,
        ...data,
    };
};
