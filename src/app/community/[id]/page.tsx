import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { formatDate } from "@/lib/format";
import { createComment } from "../actions";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*, profiles(nickname)")
    .eq("id", id)
    .single();

  if (!post) notFound();

  const { data: comments } = await supabase
    .from("comments")
    .select("*, profiles(nickname)")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  const currentUser = await getCurrentUser();
  const authorNickname =
    (post as unknown as { profiles: { nickname: string } | null }).profiles
      ?.nickname ?? "익명";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <article>
        <div className="flex items-center gap-2">
          {post.is_answered && (
            <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
              답변완료
            </span>
          )}
          <h1 className="text-xl font-bold">{post.title}</h1>
        </div>
        <p className="mt-2 text-xs text-neutral-400">
          {authorNickname} · {formatDate(post.created_at)}
        </p>
        <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-neutral-700">
          {post.content}
        </p>
      </article>

      <section className="mt-10 border-t border-neutral-200 pt-8">
        <h2 className="mb-4 text-sm font-semibold text-neutral-700">
          댓글 {comments?.length ?? 0}개
        </h2>

        <ul className="flex flex-col gap-4">
          {comments?.map((comment) => {
            const nickname =
              (comment as unknown as { profiles: { nickname: string } | null })
                .profiles?.nickname ?? "익명";
            return (
              <li
                key={comment.id}
                className={`rounded-lg border p-4 ${
                  comment.is_admin_answer
                    ? "border-neutral-900 bg-neutral-50"
                    : "border-neutral-200"
                }`}
              >
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  {comment.is_admin_answer && (
                    <span className="rounded-full bg-neutral-900 px-2 py-0.5 font-medium text-white">
                      운영자 답변
                    </span>
                  )}
                  <span>{nickname}</span>
                  <span>· {formatDate(comment.created_at)}</span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-neutral-700">
                  {comment.content}
                </p>
              </li>
            );
          })}
        </ul>

        <form action={createComment} className="mt-6 flex flex-col gap-3">
          <input type="hidden" name="postId" value={post.id} />
          <textarea
            name="content"
            rows={3}
            placeholder={currentUser ? "댓글을 남겨보세요." : "로그인 후 댓글을 남길 수 있어요."}
            required
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
          <button
            type="submit"
            className="self-start rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            댓글 등록
          </button>
        </form>
      </section>
    </div>
  );
}
