import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";

export default async function StorePage() {
  const supabase = await createClient();
  const { data: ebooks } = await supabase
    .from("ebooks")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold">전자책</h1>
      <p className="mb-8 text-sm text-neutral-500">
        취업, 공모전, 인턴 노하우를 담은 전자책을 만나보세요.
      </p>

      {!ebooks || ebooks.length === 0 ? (
        <p className="py-20 text-center text-sm text-neutral-400">
          아직 등록된 전자책이 없어요.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ebooks.map((ebook) => (
            <Link
              key={ebook.id}
              href={`/store/${ebook.slug}`}
              className="group overflow-hidden rounded-lg border border-neutral-200 transition hover:shadow-md"
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-100">
                {ebook.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ebook.cover_url}
                    alt={ebook.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
                    표지 이미지 없음
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold">{ebook.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                  {ebook.description}
                </p>
                <p className="mt-3 font-bold">{formatPrice(ebook.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
