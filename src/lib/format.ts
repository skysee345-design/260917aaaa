export function formatPrice(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
