import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/format";
import { toggleEbookPublish } from "./actions";

export default async function AdminPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: ebooks }, { data: unansweredPosts }] = await Promise.all([
    supabase.from("ebooks").select("*").order("created_at", { ascending: false }),
    supabase
      .from("posts")
      .select("id, title, created_at")
      .eq("is_answered", false)
      .order("created_at", { ascending: true }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">관리자</h1>

      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">답변 대기중인 고민글</h2>
        </div>
        {!unansweredPosts || unansweredPosts.length === 0 ? (
          <p className="text-sm text-neutral-400">답변할 글이 없어요. 모두 처리했어요 🎉</p>
        ) : (
          <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
            {unansweredPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/community/${post.id}`}
                  className="flex items-center justify-between px-1 py-3 text-sm hover:bg-neutral-50"
                >
                  <span className="truncate">{post.title}</span>
                  <span className="shrink-0 text-xs text-neutral-400">
                    {formatDate(post.created_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">전자책 관리</h2>
          <Link
            href="/admin/ebooks/new"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            전자책 등록
          </Link>
        </div>

        {!ebooks || ebooks.length === 0 ? (
          <p className="text-sm text-neutral-400">등록된 전자책이 없어요.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {ebooks.map((ebook) => (
              <li
                key={ebook.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{ebook.title}</p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {formatPrice(ebook.price)} · {ebook.is_published ? "공개중" : "비공개"}
                  </p>
                </div>
                <form action={toggleEbookPublish}>
                  <input type="hidden" name="id" value={ebook.id} />
                  <input type="hidden" name="isPublished" value={String(ebook.is_published)} />
                  <button
                    type="submit"
                    className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50"
                  >
                    {ebook.is_published ? "비공개로 전환" : "공개로 전환"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
