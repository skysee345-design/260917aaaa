import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { kakaoPayReady } from "@/lib/kakaopay";

export async function POST(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const formData = await request.formData();
  const ebookId = String(formData.get("ebookId") ?? "");

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.redirect(`${siteUrl}/login`);
  }

  const admin = createAdminClient();

  const { data: ebook } = await admin
    .from("ebooks")
    .select("*")
    .eq("id", ebookId)
    .eq("is_published", true)
    .single();

  if (!ebook) {
    return NextResponse.redirect(`${siteUrl}/store`);
  }

  const { data: purchase, error: insertError } = await admin
    .from("purchases")
    .insert({
      user_id: currentUser.id,
      ebook_id: ebook.id,
      amount: ebook.price,
      status: "pending",
      kakao_partner_order_id: crypto.randomUUID(),
    })
    .select("*")
    .single();

  if (insertError || !purchase) {
    return NextResponse.redirect(`${siteUrl}/store/${ebook.slug}?error=purchase_failed`);
  }

  try {
    const ready = await kakaoPayReady({
      partner_order_id: purchase.kakao_partner_order_id,
      partner_user_id: currentUser.id,
      item_name: ebook.title,
      quantity: 1,
      total_amount: ebook.price,
      approval_url: `${siteUrl}/api/payment/kakao/approve?purchaseId=${purchase.id}`,
      cancel_url: `${siteUrl}/api/payment/kakao/cancel?purchaseId=${purchase.id}`,
      fail_url: `${siteUrl}/api/payment/kakao/fail?purchaseId=${purchase.id}`,
    });

    await admin
      .from("purchases")
      .update({ kakao_tid: ready.tid })
      .eq("id", purchase.id);

    const isMobile = /Mobi|Android|iPhone/i.test(request.headers.get("user-agent") ?? "");

    return NextResponse.redirect(
      isMobile ? ready.next_redirect_mobile_url : ready.next_redirect_pc_url
    );
  } catch (err) {
    console.error(err);
    await admin.from("purchases").update({ status: "failed" }).eq("id", purchase.id);
    return NextResponse.redirect(`${siteUrl}/store/${ebook.slug}?error=payment_ready_failed`);
  }
}
