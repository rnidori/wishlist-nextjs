import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "내 위시리스트",
  description: "카테고리별로 정리하는 개인 위시리스트",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
