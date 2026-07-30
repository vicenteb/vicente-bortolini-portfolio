import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { createChallenge, randomInt } from "altcha-lib";
import { deriveKey } from "altcha-lib/algorithms/pbkdf2";

const getClientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

const hashIp = (ip: string, secret: string) =>
  createHmac("sha256", secret).update(ip).digest("hex").slice(0, 24);

export async function GET(request: Request) {
  const secret = process.env.ALTCHA_HMAC_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Contact verification is not configured." },
      { status: 503 },
    );
  }

  const challenge = await createChallenge({
    algorithm: "PBKDF2/SHA-256",
    cost: 5000,
    counter: randomInt(5000, 10000),
    deriveKey,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    data: {
      action: "reveal_contact",
      ipHash: hashIp(getClientIp(request), secret),
    },
    hmacSignatureSecret: secret,
    hmacKeySignatureSecret: `${secret}:key`,
  });

  return NextResponse.json(challenge, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
