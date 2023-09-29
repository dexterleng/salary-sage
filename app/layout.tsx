import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import "./globals.css";
import { Mulish } from "next/font/google";
import { cookies } from "next/headers";
import { NavigationBar } from "@/components/NavigationBar";
import UpdateSettingsDialog from "./dashboard/UpdateSettingsDialog";
import { useState } from "react";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";

const mulish = Mulish({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mulish",
});

export const metadata = {
  title: "Salary Sage",
  description: "Practice your salary negotiation skills with AI",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userData: any;
  if (user) {
    const { data } = await supabase
      .from("user")
      .select()
      .eq("userId", user.id)
      .single();
    userData = data;
  }

  const domain = "https://salary-sage.vercel.app/";

  return (
    <html lang="en" className={`${mulish.variable}`}>
      <meta property="og:type" content="website" />
      <meta property="og:url" content={domain} />
      <meta property="og:image" content={`${domain}og-main.png`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={`${domain}og-twitter.png`} />

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-01Z86204LT"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-01Z86204LT', {
              'user_id': ${user ? `"${user.id}"` : "null"}
            });
          `}
      </Script>
      <body>
        <main className="min-h-screen bg-background flex flex-col items-center">
          <NavigationBar user={user} userData={userData} />
          {children}
          <div className="w-full px-12 pt-10 pb-10 flex flex-col gap-y-1 items-center relative">
            <div className="flex-grow flex flex-row items-center gap-x-2">
              <Image
                className="inline"
                src="/app-icon.svg"
                alt="Salary Sage icon"
                width="28"
                height="28"
              />
              <span className="font-semibold text-base text-neutral-900">
                Salary Sage
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-medium text-neutral-500">
                © 2023 Salary Sage. All rights reserved.
              </p>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
