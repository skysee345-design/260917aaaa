import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "스물다섯노트 | 취업·공모전·인턴 전자책 & 고민상담",
  description:
    "20대 취업, 공모전, 인턴 노하우를 담은 전자책 판매와 고민을 나누는 커뮤니티",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white text-neutral-900">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-neutral-200 py-8 text-center text-xs text-neutral-400">
          © {new Date().getFullYear()} 스물다섯노트. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
