import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { kakaoPayApprove } from "@/lib/kakaopay";

export async function GET(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const { searchParams } = new URL(request.url);
  const purchaseId = searchParams.get("purchaseId");
  const pgToken = searchParams.get("pg_token");

  const currentUser = await getCurrentUser();
  if (!currentUser || !purchaseId || !pgToken) {
    return NextResponse.redirect(`${siteUrl}/store`);
  }

  const admin = createAdminClient();

  const { data: purchase } = await admin
    .from("purchases")
    .select("*, ebooks(slug)")
    .eq("id", purchaseId)
    .eq("user_id", currentUser.id)
    .single();

  if (!purchase || !purchase.kakao_tid) {
    return NextResponse.redirect(`${siteUrl}/store`);
  }

  const ebookSlug = (purchase as unknown as { ebooks: { slug: string } }).ebooks.slug;

  if (purchase.status === "paid") {
    return NextResponse.redirect(`${siteUrl}/mypage`);
  }

  try {
    await kakaoPayApprove({
      tid: purchase.kakao_tid,
      partner_order_id: purchase.kakao_partner_order_id,
      partner_user_id: currentUser.id,
      pg_token: pgToken,
    });

    await admin
      .from("purchases")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", purchase.id);

    return NextResponse.redirect(`${siteUrl}/mypage?purchased=${ebookSlug}`);
  } catch (err) {
    console.error(err);
    await admin.from("purchases").update({ status: "failed" }).eq("id", purchase.id);
    return NextResponse.redirect(`${siteUrl}/store/${ebookSlug}?error=payment_approve_failed`);
  }
}
