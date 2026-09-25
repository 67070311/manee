import type { Metadata } from "next";
import { Mali } from "next/font/google";
import "./globals.css";

const mali = Mali({
  variable: "--font-mali",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Your Friend | พี่หมีอยู่ตรงนี้",
  description:
    "พื้นที่เล็ก ๆ สำหรับสำรวจความรู้สึก เข้าใจตัวเอง และพักใจไปกับพี่หมี",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={mali.variable}>
      <body>{children}</body>
    </html>
  );
}
