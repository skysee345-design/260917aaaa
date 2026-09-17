// 카카오페이 온라인 결제 API 연동 헬퍼
// 문서: https://developers.kakaopay.com/docs/payment/online/common
//
// 2024년 이후 발급된 카카오페이 앱은 SECRET_KEY 인증 + open-api.kakaopay.com 도메인을 사용한다.
// (예전 카카오 로그인 관리자 키 + kapi.kakao.com 방식은 더 이상 신규 연동을 지원하지 않는다.)
// KAKAO_PAY_ADMIN_KEY 환경변수에는 "카카오페이 시크릿 키(운영/개발)" 값을 넣으면 된다.

const KAKAO_PAY_BASE_URL = "https://open-api.kakaopay.com/online/v1/payment";

function getAuthHeaders() {
  const secretKey = process.env.KAKAO_PAY_ADMIN_KEY;
  if (!secretKey) {
    throw new Error("KAKAO_PAY_ADMIN_KEY 환경변수가 설정되어 있지 않습니다.");
  }
  return {
    Authorization: `SECRET_KEY ${secretKey}`,
    "Content-Type": "application/json",
  };
}

export type KakaoReadyRequest = {
  partner_order_id: string;
  partner_user_id: string;
  item_name: string;
  quantity: number;
  total_amount: number;
  approval_url: string;
  cancel_url: string;
  fail_url: string;
};

export type KakaoReadyResponse = {
  tid: string;
  next_redirect_pc_url: string;
  next_redirect_mobile_url: string;
  next_redirect_app_url: string;
  created_at: string;
};

export async function kakaoPayReady(
  body: KakaoReadyRequest
): Promise<KakaoReadyResponse> {
  const res = await fetch(`${KAKAO_PAY_BASE_URL}/ready`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      cid: process.env.KAKAO_PAY_CID ?? "TC0ONETIME",
      tax_free_amount: 0,
      ...body,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`카카오페이 결제 준비 실패 (${res.status}): ${text}`);
  }

  return res.json();
}

export type KakaoApproveRequest = {
  tid: string;
  partner_order_id: string;
  partner_user_id: string;
  pg_token: string;
};

export type KakaoApproveResponse = {
  aid: string;
  tid: string;
  cid: string;
  partner_order_id: string;
  partner_user_id: string;
  item_name: string;
  quantity: number;
  amount: {
    total: number;
    tax_free: number;
    vat: number;
    point: number;
    discount: number;
  };
  created_at: string;
  approved_at: string;
};

export async function kakaoPayApprove(
  body: KakaoApproveRequest
): Promise<KakaoApproveResponse> {
  const res = await fetch(`${KAKAO_PAY_BASE_URL}/approve`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      cid: process.env.KAKAO_PAY_CID ?? "TC0ONETIME",
      ...body,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`카카오페이 결제 승인 실패 (${res.status}): ${text}`);
  }

  return res.json();
}
