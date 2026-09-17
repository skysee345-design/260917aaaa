# 스물다섯노트

20대 취업 · 공모전 · 인턴 노하우를 담은 **전자책 판매**와, 고민을 남기고
운영자가 직접 답변하는 **고민상담 커뮤니티**를 함께 제공하는 웹 서비스입니다.

- **기술 스택**: Next.js (App Router, TypeScript) + Tailwind CSS + Supabase(DB/Auth/Storage)
- **결제**: 카카오페이 온라인 결제 API 연동

## 주요 기능

- 이메일 회원가입 / 로그인 (Supabase Auth)
- 전자책 목록/상세, 카카오페이 결제, 결제 완료 후 마이페이지에서 다운로드
- 고민글 작성 (전체 공개), 댓글 작성, 운영자가 댓글을 달면 자동으로
  "운영자 답변" 배지가 붙고 글이 "답변완료" 상태로 바뀜
- 관리자 페이지: 전자책 등록/공개·비공개 전환, 답변 대기중인 고민글 확인

## 1. Supabase 프로젝트 설정

1. [supabase.com](https://supabase.com) 에서 새 프로젝트를 생성합니다.
2. Supabase 대시보드 → **SQL Editor** 에서
   [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql)
   내용을 실행해 테이블/정책/스토리지 버킷을 생성합니다.
3. **Project Settings → API** 에서 아래 값을 확인해 `.env.local` 에 채워 넣습니다.
   (`.env.local.example` 참고)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (⚠️ 절대 클라이언트에 노출되면 안 됩니다)
4. (선택) **Authentication → Settings** 에서 "Confirm email" 을 꺼두면
   로컬 개발 시 이메일 인증 없이 바로 로그인할 수 있습니다.

### 관리자 계정 지정

회원가입을 먼저 진행한 뒤, SQL Editor에서 아래처럼 본인 계정을 관리자로
지정하면 `/admin` 페이지에 접근할 수 있습니다.

```sql
update public.profiles set is_admin = true where id = '가입한 유저의 uuid';
-- uuid는 Authentication > Users 목록에서 확인할 수 있습니다.
```

## 2. 카카오페이 설정

1. [카카오 개발자센터](https://developers.kakaopay.com) 에서 앱을 생성하고
   카카오페이 서비스를 신청합니다.
2. 개발/테스트 단계에서는 `KAKAO_PAY_CID` 를 `TC0ONETIME` (단건 결제 테스트용
   가맹점 코드) 로 두고, 발급받은 **시크릿 키**를 `KAKAO_PAY_ADMIN_KEY` 에
   넣습니다.
3. 실제 서비스를 오픈할 때는 카카오페이 심사를 통과한 뒤 발급되는 운영용
   CID와 시크릿 키로 교체하세요.
4. 결제 연동 코드는 [`src/lib/kakaopay.ts`](./src/lib/kakaopay.ts) 와
   [`src/app/api/payment/kakao`](./src/app/api/payment/kakao) 에 있습니다.

## 3. 환경변수

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열어 위에서 확인한 값들을 채워 넣습니다.

## 4. 개발 서버 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

## 5. 전자책 등록하기

1. 관리자 계정으로 로그인 후 `/admin/ebooks/new` 로 이동합니다.
2. 제목, 가격, 소개, 표지 이미지(선택), 전자책 파일(PDF/EPUB 등)을 입력하고
   등록하면 Supabase Storage에 업로드되고 스토어에 노출됩니다.
   - 표지는 `covers` 버킷(공개)에, 전자책 파일은 `ebooks` 버킷(비공개)에
     저장됩니다.
   - 구매자는 결제 완료 후 마이페이지에서 60초간 유효한 서명된 URL로만
     파일을 다운로드할 수 있습니다.

## 폴더 구조

```
src/
  app/
    store/            전자책 스토어
    community/         고민상담 커뮤니티
    mypage/            구매 내역 & 다운로드
    admin/             관리자 (전자책 관리, 고민글 답변 대기 목록)
    api/payment/kakao/ 카카오페이 ready/approve/cancel/fail
    api/download/      구매자 전용 다운로드 라우트
  lib/
    supabase/          Supabase 클라이언트 (browser/server/admin/middleware)
    kakaopay.ts         카카오페이 API 헬퍼
supabase/
  migrations/0001_init.sql  DB 스키마 & RLS 정책
```

## 배포

Vercel 등에 배포할 때는 위 환경변수를 프로젝트 설정에 동일하게 등록하고,
`NEXT_PUBLIC_SITE_URL` 을 실제 배포 도메인(`https://...`)으로 바꿔주세요.
카카오페이 결제 승인/취소/실패 콜백 URL이 이 값을 기준으로 생성됩니다.
