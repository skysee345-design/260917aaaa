export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="mb-3 text-2xl font-bold">고민상담 커뮤니티</h1>
      <p className="text-sm text-neutral-500">
        취업, 진로, 공모전, 인턴에 대한 고민을 나누는 공간을 준비하고 있어요.
        오픈 전까지는 아래 이메일로 고민을 남겨주시면 답변해드릴게요.
      </p>
      <a
        href="mailto:hello@example.com?subject=%5B%EA%B3%A0%EB%AF%BC%20%EC%83%81%EB%8B%B4%5D"
        className="mt-6 inline-block rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700"
      >
        고민 메일로 남기기
      </a>
    </div>
  );
}
