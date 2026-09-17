"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";

export async function createPost(formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/community/new");

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !content) {
    redirect(`/community/new?error=${encodeURIComponent("제목과 내용을 모두 입력해주세요.")}`);
  }

  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from("posts")
    .insert({ user_id: currentUser.id, title, content })
    .select("id")
    .single();

  if (error || !post) {
    redirect(`/community/new?error=${encodeURIComponent("글 작성에 실패했어요.")}`);
  }

  revalidatePath("/community");
  redirect(`/community/${post.id}`);
}

export async function createComment(formData: FormData) {
  const currentUser = await getCurrentUser();
  const postId = String(formData.get("postId") ?? "");
  if (!currentUser) redirect(`/login?next=/community/${postId}`);

  const content = String(formData.get("content") ?? "").trim();
  if (!content) redirect(`/community/${postId}`);

  const supabase = await createClient();
  await supabase.from("comments").insert({
    post_id: postId,
    user_id: currentUser.id,
    content,
  });

  revalidatePath(`/community/${postId}`);
  redirect(`/community/${postId}`);
}
