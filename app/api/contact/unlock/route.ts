import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { verifySolution, type Payload } from "altcha-lib";
import { deriveKey } from "altcha-lib/algorithms/pbkdf2";

const getClientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

const hashIp = (ip: string, secret: string) =>
  createHmac("sha256", secret).update(ip).digest("hex").slice(0, 24);

export async function POST(request: Request) {
  const secret = process.env.ALTCHA_HMAC_SECRET;
  const phone = process.env.CONTACT_PHONE;
  const email = process.env.CONTACT_EMAIL;

  if (!secret || !phone || !email) {
    return NextResponse.json(
      { success: false, error: "Contact verification is not configured." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as { payload?: string };
    if (!body.payload) {
      return NextResponse.json(
        { success: false, error: "Verification payload is required." },
        { status: 400 },
      );
    }

    const payload = JSON.parse(
      Buffer.from(body.payload, "base64").toString("utf8"),
    ) as Payload;
    const expectedIpHash = hashIp(getClientIp(request), secret);

    if (payload.challenge.parameters.data?.ipHash !== expectedIpHash) {
      return NextResponse.json(
        { success: false, error: "Verification context changed." },
        { status: 403 },
      );
    }

    const result = await verifySolution({
      challenge: payload.challenge,
      solution: payload.solution,
      deriveKey,
      hmacSignatureSecret: secret,
      hmacKeySignatureSecret: `${secret}:key`,
    });

    if (!result.verified || result.expired) {
      return NextResponse.json(
        { success: false, error: "Human verification failed." },
        { status: 403 },
      );
    }

    return NextResponse.json({
      success: true,
      contact: { phone, email },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid verification payload." },
      { status: 400 },
    );
  }
}
