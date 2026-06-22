import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { OfflineIndicator } from "@/components/shared/offline-indicator";
import { PageTransition } from "@/components/layout/page-transition";
import { FooterWrapper } from "@/components/layout/footer-wrapper";
import { Toaster } from "sonner";
import { routing } from "@/i18n/routing";
import { DebugBar } from "@/components/debug/debug-bar";
import { AuthProvider } from "@/lib/auth-context";

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
      <AuthProvider>
      <ThemeProvider defaultTheme="light" enableSystem>
          <OfflineIndicator />
          <div className="flex min-h-dvh flex-col">
            <div className="flex-1">
              <PageTransition>
                {children}
              </PageTransition>
            </div>
            <FooterWrapper />
          </div>
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
        {process.env.NODE_ENV !== 'production' && <DebugBar />}
      </ThemeProvider>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
