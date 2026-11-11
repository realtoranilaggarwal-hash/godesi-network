import { NextResponse } from "next/server";
import { headers } from "next/headers";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

/** PNG QR for godesi.us/<slug> — the short link itself, for print and shares. */
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const host =
    headers().get("x-forwarded-host") ?? headers().get("host") ?? "godesi.us";
  const target = `https://${host}/${params.slug}`;
  const png = await QRCode.toBuffer(target, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 480,
    color: { dark: "#111111", light: "#ffffff" },
  });
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=86400",
    },
  });
}
