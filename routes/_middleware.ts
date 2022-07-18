import { MiddlewareHandlerContext } from "$fresh/server.ts";

import * as jose from "https://deno.land/x/jose@v4.7.0/index.ts";
import { ServerUser } from "../models/server-user.ts";

interface State {
  serverUser: ServerUser | null;
}

const decodeCookie = (str: string | null) =>
  str
    ? str
      .split(";")
      .map((v) => v.split("="))
      .reduce((acc: any, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
          (v[1] || "").trim(),
        );
        return acc;
      }, {})
    : { idToken: null };

const certificate =
  `-----BEGIN CERTIFICATE-----MIIDHDCCAgSgAwIBAgIIJumgSP1FZKIwDQYJKoZIhvcNAQEFBQAwMTEvMC0GA1UE\nAwwmc2VjdXJldG9rZW4uc3lzdGVtLmdzZXJ2aWNlYWNjb3VudC5jb20wHhcNMjIw\nNzE0MDkzODUxWhcNMjIwNzMwMjE1MzUxWjAxMS8wLQYDVQQDDCZzZWN1cmV0b2tl\nbi5zeXN0ZW0uZ3NlcnZpY2VhY2NvdW50LmNvbTCCASIwDQYJKoZIhvcNAQEBBQAD\nggEPADCCAQoCggEBAIdYQMpwHWbDHJ0L7zROWBHsAt0CFK3Ngsw4wGaKJ6sCMGsK\nSbKFxhiW1O4zV1jUQvAEh7kHdDe2+f/+CTSPkDpXy7mCtYVxD27u/ZPpWrwtGIzy\nDh0+3+q5jRrbVpj3EkEfZwD7+TxTmMFNy8uM0D+HuBmouJDmbNNM1ljIeoAwFpGB\nt3PUithUZipjFION6qzzq99Uzp3DTlfowpdE3/oyyuTSIdoO/1J8lfyaYf923X/g\nd7pXBDrtpvrnOi6MOPJYwnihuIEIE85WP4ZebBSBhEabwEllLjJuT/G158CHWVuv\nzjiDrfr2joYHUO53qLun1Sa0Yf4oUZq0F2NN4J0CAwEAAaM4MDYwDAYDVR0TAQH/\nBAIwADAOBgNVHQ8BAf8EBAMCB4AwFgYDVR0lAQH/BAwwCgYIKwYBBQUHAwIwDQYJ\nKoZIhvcNAQEFBQADggEBAAdbV/PMwun8VqaPHbjJPrIAA5NfZL1xW7d8GgKYtuCc\nTysB+OS15FvQZmfAYG0Ck7fnS1M/fsyjlErzQSsDiajp71bafUcepbQVx46C0ABy\nysizYhlOqqCdLFBzmzDDNvcNb8FYymjkqZTnb7vq6pvf/NB9wmgiOlZ2xfoMB2ED\njt1gZ634xSDNR8k6Gc1NhzdL8N3rc8CvBYxIwop7R+a+UE4k3gmP1rAPlInu9CxO\na1eE4RqxwVPDfo9vejWiaS6yX8Ktm99gnBVV4FZJsRBBCkAkADelfdIFJQt3IIlF\nOiFGrArbRBk3q8arnzu8EBev0jjM4bDoxg5HoyNhZ5c=-----END CERTIFICATE-----`;
const rsaPublicKey = await jose.importX509(certificate, "RS256");

const verifyIdToken = async (idToken: string) => {
  const { payload } = await jose.jwtVerify(idToken, rsaPublicKey);
  return payload;
};

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
): Promise<any> {
  const headers = req.headers;
  const { idToken } = decodeCookie(headers.get("cookie"));
  ctx.state.serverUser = null;

  if (idToken) {
    const payload = await verifyIdToken(idToken).catch(() => {});
    if (payload && "user_id" in payload && "email" in payload) {
      ctx.state.serverUser = {
        uid: payload.user_id as string,
        email: payload.email as string,
      };
    }
  }

  return await ctx.next();
}
