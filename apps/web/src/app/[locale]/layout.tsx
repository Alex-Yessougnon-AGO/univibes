import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { OfflineIndicator } from "@/components/shared/offline-indicator";
import { PageTransition } from "@/components/layout/page-transition";
import { Toaster } from "sonner";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider defaultTheme="light" enableSystem>
        <MotionConfig reducedMotion="user">
          <OfflineIndicator />
          <PageTransition>
            {children}
          </PageTransition>
        </MotionConfig>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            },
          }}
        />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
