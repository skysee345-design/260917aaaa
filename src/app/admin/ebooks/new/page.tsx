import { requireAdmin } from "@/lib/require-admin";
import { createEbook } from "../../actions";

export default async function NewEbookPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">전자책 등록</h1>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <form action={createEbook} encType="multipart/form-data" className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">제목</label>
          <input
            type="text"
            name="title"
            required
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            슬러그 (URL, 비워두면 제목으로 자동 생성)
          </label>
          <input
            type="text"
            name="slug"
            placeholder="예: resume-guide"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">소개</label>
          <textarea
            name="description"
            rows={6}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">가격 (원)</label>
          <input
            type="number"
            name="price"
            min={0}
            step={100}
            required
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            표지 이미지 (선택)
          </label>
          <input type="file" name="cover" accept="image/*" className="w-full text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            전자책 파일 (PDF, EPUB 등)
          </label>
          <input type="file" name="book" required className="w-full text-sm" />
        </div>
        <button
          type="submit"
          className="mt-2 self-start rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700"
        >
          등록하기
        </button>
      </form>
    </div>
  );
}
