export const generateSlugFromName = (name: string) => {
  return name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

export const generateStockSlug = (title: string) => {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Math.random().toString(36).substring(2, 7)
  );
};

export function generateSecurePassword(
  length = 16,
  { lowercase = true, uppercase = true, numbers = true, symbols = true } = {},
) {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const number = "0123456789";
  const symbol = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  let charset = "";
  if (lowercase) charset += lower;
  if (uppercase) charset += upper;
  if (numbers) charset += number;
  if (symbols) charset += symbol;

  if (!charset) {
    throw new Error("Minimal satu jenis karakter harus diaktifkan");
  }

  const password = [];
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    password.push(charset[randomValues[i] % charset.length]);
  }

  return password.join("");
}

export function generateUsername(fullName: string) {
  if (!fullName || typeof fullName !== "string") {
    throw new Error("Full name harus berupa string");
  }

  // 1. Normalisasi nama
  const baseUsername = fullName
    .toLowerCase()
    .trim()
    .replace(/[^a-z\s]/g, "") // hapus karakter aneh
    .replace(/\s+/g, ""); // hapus spasi

  // 2. Generate 4 digit angka acak (secure)
  const randomNumber = new Uint16Array(1);
  crypto.getRandomValues(randomNumber);

  const suffix = String(randomNumber[0] % 10000).padStart(4, "0");

  return `${baseUsername}-${suffix}`;
}

export const convertCreditToRealCurrency = (
  creditAmount: number,
  currency: "IDR" | "USD",
) => {
  return currency === "IDR" ? creditAmount * 1000 : creditAmount * 0.05;
};

export const convertRealCurrencyToCredit = (
  amount: number,
  currency: "IDR" | "USD",
) => {
  return currency === "IDR" ? amount / 1000 : amount / 0.05;
};

export const convertCentToUsd = (cent: number) => {
  return cent / 100;
};

/**
 * Strips basic Markdown formatting characters from a string.
 * Useful for displaying plain text excerpts from Markdown content.
 */
export const stripMarkdown = (markdown?: string | null): string => {
  if (!markdown) return "";
  
  return markdown
    // Remove headers (## Header)
    .replace(/^#+\s+/gm, "")
    // Remove bold/italic (**bold**, *italic*, __bold__, _italic_)
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
    // Remove blockquotes (> quote)
    .replace(/^>\s+/gm, "")
    // Remove inline code (`code`)
    .replace(/`([^`]+)`/g, "$1")
    // Remove images (![alt](url))
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
    // Replace links with just their text ([text](url) -> text)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove strikethrough (~~text~~)
    .replace(/~~([^~]+)~~/g, "$1")
    // Remove unordered list bullets (- item, * item, + item)
    .replace(/^[-*+]\s+/gm, "")
    // Remove ordered list numbers (1. item)
    .replace(/^\d+\.\s+/gm, "")
    // Replace multiple newlines with a single space
    .replace(/\n+/g, " ")
    .trim();
};

