import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

const ALGO = "aes-256-gcm";

/**
 * Derive a 32-byte key from a server-only secret.
 * Prefer ORDER_STATUS_TOKEN_SECRET (≥32), else KITCHEN_SECRET.
 */
function getEncryptionKey(): Buffer | null {
  const dedicated = process.env.ORDER_STATUS_TOKEN_SECRET?.trim();
  const kitchen = process.env.KITCHEN_SECRET?.trim();
  const material =
    dedicated && dedicated.length >= 32
      ? dedicated
      : kitchen && kitchen.length >= 32
        ? kitchen
        : null;
  if (!material) return null;
  return createHash("sha256").update(`gg-status-token:${material}`, "utf8").digest();
}

export function canEncryptAccessToken(): boolean {
  return getEncryptionKey() !== null;
}

/** Encrypt plaintext status token for server-only DB storage (never select for clients). */
export function encryptAccessToken(token: string): string | null {
  const key = getEncryptionKey();
  if (!key) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString("base64url")}:${tag.toString("base64url")}:${enc.toString("base64url")}`;
}

export function decryptAccessToken(ciphertext: string | null | undefined): string | null {
  if (!ciphertext?.startsWith("v1:")) return null;
  const key = getEncryptionKey();
  if (!key) return null;
  const parts = ciphertext.split(":");
  if (parts.length !== 4) return null;
  const [, ivB64, tagB64, dataB64] = parts;
  try {
    const iv = Buffer.from(ivB64, "base64url");
    const tag = Buffer.from(tagB64, "base64url");
    const data = Buffer.from(dataB64, "base64url");
    const decipher = createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}
