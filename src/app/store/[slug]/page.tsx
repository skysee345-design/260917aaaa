import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

const ERROR_MESSAGES: Record<string, string> = {
  purchase_failed: "구매 요청에 실패했어요. 다시 시도해주세요.",
  payment_ready_failed: "결제 준비 중 오류가 발생했어요. 다시 시도해주세요.",
  payment_approve_failed: "결제 승인 중 오류가 발생했어요. 다시 시도해주세요.",
  payment_canceled: "결제가 취소되었어요.",
  payment_failed: "결제에 실패했어요.",
};

export default async function EbookDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: ebook } = await supabase
    .from("ebooks")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!ebook) notFound();

  const currentUser = await getCurrentUser();

  let alreadyPurchased = false;
  if (currentUser) {
    const { data: purchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("ebook_id", ebook.id)
      .eq("user_id", currentUser.id)
      .eq("status", "paid")
      .maybeSingle();
    alreadyPurchased = !!purchase;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {error && ERROR_MESSAGES[error] && (
        <p className="mb-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {ERROR_MESSAGES[error]}
        </p>
      )}
      <div className="grid gap-8 sm:grid-cols-[240px_1fr]">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-neutral-100">
          {ebook.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ebook.cover_url}
              alt={ebook.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
              표지 이미지 없음
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold">{ebook.title}</h1>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
            {ebook.description}
          </p>

          <p className="mt-6 text-2xl font-bold">{formatPrice(ebook.price)}</p>

          <div className="mt-6">
            {alreadyPurchased ? (
              <Link
                href="/mypage"
                className="inline-block rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700"
              >
                이미 구매했어요 · 마이페이지에서 다운로드
              </Link>
            ) : currentUser ? (
              <form action="/api/payment/kakao/ready" method="POST">
                <input type="hidden" name="ebookId" value={ebook.id} />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md bg-[#FEE500] px-5 py-2.5 text-sm font-semibold text-[#191600] hover:brightness-95"
                >
                  카카오페이로 구매하기
                </button>
              </form>
            ) : (
              <Link
                href={`/login?next=/store/${ebook.slug}`}
                className="inline-block rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700"
              >
                로그인하고 구매하기
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
