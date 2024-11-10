import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Sans } from 'next/font/google'
import "./globals.css";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

const dm_sans = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Momentum",
  description: "Momentum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/letter-m.png" type="image/png" />
      <body className={dm_sans.className}
      >
        {children}
      </body>
    </html>
  );
}
