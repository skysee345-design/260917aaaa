# 스물다섯노트

20대 취업 · 공모전 · 인턴 노하우를 담은 전자책 판매와 고민상담 커뮤니티를
위한 웹사이트입니다.

> 현재는 백엔드(Supabase) 없이 **기본적인 정적 사이트**만 구성되어 있습니다.
> 회원가입/로그인, 실제 결제, 글쓰기 등 DB가 필요한 기능은 빠져 있고, 전자책
> 목록은 `src/lib/ebooks-data.ts`의 하드코딩된 데이터를 보여주기만 합니다.
> 나중에 회원가입/결제/커뮤니티 글쓰기 기능이 필요해지면 Supabase 등
> 백엔드를 다시 연결하면 됩니다.

## 기술 스택

- Next.js (App Router, TypeScript)
- Tailwind CSS

## 페이지 구성

- `/` : 랜딩 페이지
- `/store` : 전자책 목록 (정적 데이터, 구매 문의는 이메일 링크)
- `/community` : 고민상담 안내 페이지 (이메일로 고민 접수)

## 개발 서버 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

## 빌드

```bash
npm run build
```

Netlify, Vercel 등 어디에 배포하든 별도의 환경변수 없이 바로 빌드/배포할 수
있습니다.

## 내용 수정하기

- 전자책 목록: `src/lib/ebooks-data.ts`
- 구매 문의 / 고민상담 이메일 주소: `src/app/store/page.tsx`,
  `src/app/community/page.tsx` 안의 `hello@example.com` 을 실제 이메일로
  바꿔주세요.
- 홈페이지 문구: `src/app/page.tsx`
