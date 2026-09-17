import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const { searchParams } = new URL(request.url);
  const purchaseId = searchParams.get("purchaseId");

  const admin = createAdminClient();

  let ebookSlug = "";
  if (purchaseId) {
    const { data: purchase } = await admin
      .from("purchases")
      .update({ status: "canceled" })
      .eq("id", purchaseId)
      .eq("status", "pending")
      .select("*, ebooks(slug)")
      .single();
    ebookSlug = (purchase as unknown as { ebooks?: { slug: string } } | null)?.ebooks?.slug ?? "";
  }

  return NextResponse.redirect(
    `${siteUrl}${ebookSlug ? `/store/${ebookSlug}` : "/store"}?error=payment_canceled`
  );
}
