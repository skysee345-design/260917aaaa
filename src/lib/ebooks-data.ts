// 실제 판매 기능(결제/다운로드)은 아직 연결되어 있지 않은 정적 데이터입니다.
// 추후 Supabase 등 백엔드를 연결하면 이 파일 대신 DB에서 목록을 불러오면 됩니다.
export type EbookPreview = {
  slug: string;
  title: string;
  description: string;
  price: number;
};

export const ebooks: EbookPreview[] = [
  {
    slug: "resume-guide",
    title: "합격하는 자기소개서의 비밀",
    description:
      "서류 통과율을 높이는 자기소개서 구조와 실제 합격 자소서 예시를 담았어요.",
    price: 9900,
  },
  {
    slug: "contest-guide",
    title: "공모전 수상으로 가는 기획서 작성법",
    description: "기획 아이디어부터 발표까지, 공모전 수상 노하우를 정리했어요.",
    price: 12900,
  },
  {
    slug: "intern-guide",
    title: "인턴 합격부터 정규직 전환까지",
    description: "인턴 지원 전략과 실무에서 인정받는 방법을 담았어요.",
    price: 9900,
  },
];
