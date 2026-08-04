import { GET as getAppleIcon } from "../api/apple-icon/route";

export const dynamic = "force-static";

export function GET() {
  return getAppleIcon();
}
