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
