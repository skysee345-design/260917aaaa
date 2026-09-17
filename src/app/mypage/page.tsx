import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { formatDate, formatPrice } from "@/lib/format";

export default async function MyPage({
  searchParams,
}: {
  searchParams: Promise<{ purchased?: string }>;
}) {
  const { purchased } = await searchParams;
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/mypage");

  const supabase = await createClient();
  const { data: purchases } = await supabase
    .from("purchases")
    .select("*, ebooks(title, slug, cover_url)")
    .eq("user_id", currentUser.id)
    .eq("status", "paid")
    .order("paid_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold">마이페이지</h1>
      <p className="mb-8 text-sm text-neutral-500">
        {currentUser.profile?.nickname}님, 구매하신 전자책을 다운로드할 수 있어요.
      </p>

      {purchased && (
        <p className="mb-6 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          결제가 완료되었어요! 아래 목록에서 전자책을 다운로드하세요.
        </p>
      )}

      {!purchases || purchases.length === 0 ? (
        <p className="py-20 text-center text-sm text-neutral-400">
          아직 구매한 전자책이 없어요.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {purchases.map((purchase) => {
            const ebook = (
              purchase as unknown as {
                ebooks: { title: string; slug: string; cover_url: string | null };
              }
            ).ebooks;
            return (
              <li
                key={purchase.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{ebook.title}</p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {formatPrice(purchase.amount)} ·{" "}
                    {purchase.paid_at ? formatDate(purchase.paid_at) : ""} 구매
                  </p>
                </div>
                <a
                  href={`/api/download/${purchase.id}`}
                  className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
                >
                  다운로드
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
