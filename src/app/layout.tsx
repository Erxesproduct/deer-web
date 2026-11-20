import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AddedToast, BottomBar } from "@/components/header-tools";
import { business } from "@/content/business";
import { siteUrl } from "@/lib/site-url";
import { forum, manrope, vibes } from "./fonts";
import "./globals.css";

const description = "DEER Mongolia: үндэсний өвийг орчин үеийн хэлбэрээр. Монгол хувцас, сүлжмэл, ноолуур малгай, гадуур хувцас, Winter Dream шинэ жилийн цуглуулга. Маргааш нь хүргэнэ, QPay.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${business.alias}: монгол хувцас, сүлжмэл, шинэ жилийн цуглуулга`, template: `%s · ${business.name}` },
  description,
  openGraph: { type: "website", siteName: business.alias, locale: "mn_MN", description, images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#5c0f17", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${forum.variable} ${manrope.variable} ${vibes.variable}`} suppressHydrationWarning>
      <head>
        {/* scroll-reveal hides blocks only when JS runs */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-wine focus:px-4 focus:py-2 focus:text-snow">
          Үндсэн агуулга руу
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <BottomBar />
        <AddedToast />
      </body>
    </html>
  );
}
