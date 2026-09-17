import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  const { purchaseId } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: purchase } = await admin
    .from("purchases")
    .select("*, ebooks(file_path)")
    .eq("id", purchaseId)
    .eq("user_id", currentUser.id)
    .eq("status", "paid")
    .single();

  if (!purchase) {
    return NextResponse.json({ error: "구매 내역을 찾을 수 없습니다." }, { status: 404 });
  }

  const filePath = (purchase as unknown as { ebooks: { file_path: string } }).ebooks
    .file_path;

  const { data: signed, error } = await admin.storage
    .from("ebooks")
    .createSignedUrl(filePath, 60); // 60초 동안만 유효

  if (error || !signed) {
    return NextResponse.json({ error: "다운로드 링크 생성에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
