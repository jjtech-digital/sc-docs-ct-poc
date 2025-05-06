import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from "@commercetools/ts-client";

import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

const projectKey = process.env.CT_PROJECT_KEY!;
const clientId = process.env.CT_CLIENT_ID!;
const clientSecret = process.env.CT_CLIENT_SECRET!;
const authUrl = process.env.CT_AUTH_URL!;
const apiUrl = process.env.CT_API_URL!;
const scope = process.env.CT_SCOPE!;
const scopes = [`${scope}:${projectKey}`];

// Auth middleware config
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: authUrl,
  projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
  scopes,
  httpClient: fetch,
};

// HTTP middleware config
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
  httpClient: fetch,
};

// Build the client
export const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey,
});
