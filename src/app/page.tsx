import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="mb-3 text-sm font-medium text-neutral-500">
          20대의 취업 · 공모전 · 인턴을 위한 공간
        </p>
        <h1 className="text-3xl font-bold leading-snug sm:text-4xl">
          현실적인 노하우는 전자책으로,
          <br />
          풀리지 않는 고민은 커뮤니티에서.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-neutral-500 sm:text-base">
          취업 준비, 공모전 수상, 인턴 합격까지 직접 겪고 정리한 노하우를
          전자책으로 만나보고, 혼자 끙끙 앓던 고민은 편하게 남겨보세요.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/store"
            className="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700"
          >
            전자책 보러가기
          </Link>
          <Link
            href="/community"
            className="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            고민 남기기
          </Link>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-16 sm:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-2 text-lg font-semibold">📘 전자책</h2>
            <p className="text-sm text-neutral-500">
              자기소개서, 면접, 공모전 기획서, 인턴 실전 팁까지 — 실제
              합격/수상 경험을 바탕으로 정리한 전자책을 구매하고 바로
              다운로드할 수 있어요.
            </p>
            <Link
              href="/store"
              className="mt-4 inline-block text-sm font-medium text-neutral-900 underline"
            >
              전자책 목록 보기 →
            </Link>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-2 text-lg font-semibold">💬 고민상담 커뮤니티</h2>
            <p className="text-sm text-neutral-500">
              취업, 진로, 공모전, 인턴 관련 고민을 자유롭게 남겨주세요. 모든
              글은 누구나 볼 수 있고, 운영자가 직접 답변을 남겨드려요.
            </p>
            <Link
              href="/community"
              className="mt-4 inline-block text-sm font-medium text-neutral-900 underline"
            >
              커뮤니티 가기 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
