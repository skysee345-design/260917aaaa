import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          스물다섯노트
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-neutral-600">
          <Link href="/store" className="hover:text-neutral-900">
            전자책
          </Link>
          <Link href="/community" className="hover:text-neutral-900">
            고민상담
          </Link>
        </nav>
      </div>
    </header>
  );
}
