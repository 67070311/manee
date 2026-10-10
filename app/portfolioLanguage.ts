// Shared between Server Components and the client-side language switcher.
export type PortfolioLanguage = "en" | "th";
export const PORTFOLIO_LANGUAGE_KEY = "manee-portfolio-language";
export const normalizePortfolioLanguage = (value: string | undefined | null): PortfolioLanguage =>
  value === "th" ? "th" : "en";
