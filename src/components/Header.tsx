import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { signOut } from "@/app/login/actions";

export default async function Header() {
  const currentUser = await getCurrentUser();

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

          {currentUser ? (
            <>
              <Link href="/mypage" className="hover:text-neutral-900">
                마이페이지
              </Link>
              {currentUser.profile?.is_admin && (
                <Link
                  href="/admin"
                  className="rounded-md bg-neutral-100 px-2 py-1 text-neutral-700 hover:bg-neutral-200"
                >
                  관리자
                </Link>
              )}
              <span className="text-neutral-400">
                {currentUser.profile?.nickname}님
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="hover:text-neutral-900"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-neutral-900">
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-neutral-900 px-3 py-1.5 text-white hover:bg-neutral-700"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
