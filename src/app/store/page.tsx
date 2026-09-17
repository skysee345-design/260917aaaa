import { ebooks } from "@/lib/ebooks-data";
import { formatPrice } from "@/lib/format";

export default function StorePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold">전자책</h1>
      <p className="mb-8 text-sm text-neutral-500">
        취업, 공모전, 인턴 노하우를 담은 전자책을 만나보세요. 구매 문의는
        이메일로 받고 있어요.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ebooks.map((ebook) => (
          <div
            key={ebook.slug}
            className="flex flex-col overflow-hidden rounded-lg border border-neutral-200"
          >
            <div className="flex aspect-[3/4] w-full items-center justify-center bg-neutral-100 text-sm text-neutral-400">
              표지 이미지 준비중
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h2 className="font-semibold">{ebook.title}</h2>
              <p className="mt-1 flex-1 text-sm text-neutral-500">
                {ebook.description}
              </p>
              <p className="mt-3 font-bold">{formatPrice(ebook.price)}</p>
              <a
                href={`mailto:hello@example.com?subject=${encodeURIComponent(
                  `[전자책 구매 문의] ${ebook.title}`
                )}`}
                className="mt-4 inline-block rounded-md bg-neutral-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-neutral-700"
              >
                구매 문의하기
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
