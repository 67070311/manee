import type { Metadata } from "next";
import { Kumbh_Sans } from "next/font/google";

import "./globals.css";

import Navbar from "./component/navbar";
import Footer from "./component/footer";

const kumbhSans = Kumbh_Sans({
  subsets: ["latin"],
  variable: "--font-kumbh-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DesignCup",
  description: "DesignCup by BuildifyX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={kumbhSans.variable}>
      <body className="font-sans">
        <Navbar />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
