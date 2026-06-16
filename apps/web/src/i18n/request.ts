import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import frMessages from "../../messages/fr.json";
import enMessages from "../../messages/en.json";

type Messages = typeof frMessages;

const allMessages: Record<(typeof routing.locales)[number], Messages> = {
  fr: frMessages,
  en: enMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: allMessages[locale as keyof typeof allMessages],
  };
});
