import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles(nickname)")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">고민상담</h1>
          <p className="mt-1 text-sm text-neutral-500">
            취업, 진로, 공모전, 인턴에 대한 고민을 자유롭게 나눠보세요.
          </p>
        </div>
        <Link
          href="/community/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          글쓰기
        </Link>
      </div>

      {!posts || posts.length === 0 ? (
        <p className="py-20 text-center text-sm text-neutral-400">
          아직 등록된 고민글이 없어요. 첫 글을 남겨보세요!
        </p>
      ) : (
        <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/community/${post.id}`}
                className="flex items-center justify-between gap-4 px-1 py-4 hover:bg-neutral-50"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {post.is_answered && (
                      <span className="shrink-0 rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
                        답변완료
                      </span>
                    )}
                    <h2 className="truncate font-medium">{post.title}</h2>
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">
                    {(post as unknown as { profiles: { nickname: string } | null })
                      .profiles?.nickname ?? "익명"}{" "}
                    · {formatDate(post.created_at)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
