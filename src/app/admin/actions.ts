"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createEbook(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const coverFile = formData.get("cover") as File | null;
  const bookFile = formData.get("book") as File | null;
  const rawSlug = String(formData.get("slug") ?? "").trim();

  if (!title || !bookFile || bookFile.size === 0 || !Number.isFinite(price)) {
    redirect(`/admin/ebooks/new?error=${encodeURIComponent("제목, 가격, 전자책 파일은 필수입니다.")}`);
  }

  const slug = slugify(rawSlug || title);
  const admin = createAdminClient();
  const stamp = Date.now();

  const bookExt = bookFile.name.split(".").pop();
  const bookPath = `${slug}-${stamp}.${bookExt}`;
  const { error: bookUploadError } = await admin.storage
    .from("ebooks")
    .upload(bookPath, bookFile, { contentType: bookFile.type });

  if (bookUploadError) {
    redirect(`/admin/ebooks/new?error=${encodeURIComponent("전자책 파일 업로드에 실패했어요: " + bookUploadError.message)}`);
  }

  let coverUrl: string | null = null;
  if (coverFile && coverFile.size > 0) {
    const coverExt = coverFile.name.split(".").pop();
    const coverPath = `${slug}-${stamp}.${coverExt}`;
    const { error: coverUploadError } = await admin.storage
      .from("covers")
      .upload(coverPath, coverFile, { contentType: coverFile.type });

    if (!coverUploadError) {
      const { data } = admin.storage.from("covers").getPublicUrl(coverPath);
      coverUrl = data.publicUrl;
    }
  }

  const { error: insertError } = await admin.from("ebooks").insert({
    slug,
    title,
    description,
    price,
    cover_url: coverUrl,
    file_path: bookPath,
    is_published: true,
  });

  if (insertError) {
    redirect(`/admin/ebooks/new?error=${encodeURIComponent("전자책 등록에 실패했어요: " + insertError.message)}`);
  }

  revalidatePath("/store");
  revalidatePath("/admin");
  redirect("/admin?created=1");
}

export async function toggleEbookPublish(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const isPublished = formData.get("isPublished") === "true";

  const admin = createAdminClient();
  await admin.from("ebooks").update({ is_published: !isPublished }).eq("id", id);

  revalidatePath("/store");
  revalidatePath("/admin");
}
