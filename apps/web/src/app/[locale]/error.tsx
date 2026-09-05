"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <EmptyState
        icon={TriangleAlert}
        title={t("common.error")}
        description={t("error.description")}
        actions={
          <>
            <Button variant="primary" size="md" className="rounded-full px-6" onClick={reset}>
              {t("common.retry")}
            </Button>
            <Button variant="outline" size="md" className="rounded-full px-6" asChild>
              <Link href="/">{t("common.home")}</Link>
            </Button>
          </>
        }
      />
    </main>
  );
}
