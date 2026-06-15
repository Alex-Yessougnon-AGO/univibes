"use client";

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <div className="min-h-dvh flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold mb-4">Une erreur est survenue</h1>
            <p className="text-[var(--text-secondary)] mb-6">
              Nous avons été notifiés. Si le problème persiste, réessaie plus tard.
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 rounded-xl bg-[var(--brand)] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
