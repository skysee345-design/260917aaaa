import Link from "next/link";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-8 text-2xl font-bold">로그인</h1>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <form action={login} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next ?? "/"} />
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            이메일
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            비밀번호
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="mt-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          로그인
        </button>
      </form>

      <p className="mt-6 text-sm text-neutral-500">
        아직 계정이 없으신가요?{" "}
        <Link href="/signup" className="font-medium text-neutral-900 underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
