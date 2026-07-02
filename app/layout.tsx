import type { Metadata } from "next";
import { Paytone_One, Athiti } from "next/font/google";
import "./globals.css";

const paytoneOne = Paytone_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-paytone-one",
  preload: true,
});

const athiti = Athiti({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-athiti",
  style: "normal",
  preload: true,
});

export const metadata: Metadata = {
  title: "Shirtime",
  description: "Shirtime shop on time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="shortcut icon"
          href="/logo_favicon.ico"
          type="image/x-icon"
        />

        <meta
          name="google-site-verification"
          content="yM8uv0TXDO21p5vj5KHRXwUHJWiuIN25IucmFOlwMPs"
        />
      </head>
      <body className={`${athiti.variable} ${paytoneOne.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
