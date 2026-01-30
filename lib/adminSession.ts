import crypto from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_DAYS = 7;

const getSecret = () =>
  process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";

const sign = (payload: string, secret: string) =>
  crypto.createHmac("sha256", secret).update(payload).digest("hex");

export const createAdminSessionToken = (): string => {
  const secret = getSecret();
  if (!secret) return "";
  const issuedAt = Date.now();
  const expiresAt = issuedAt + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${issuedAt}.${expiresAt}`;
  const signature = sign(payload, secret);
  return `${payload}.${signature}`;
};

export const isValidAdminSessionToken = (token: string | undefined): boolean => {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [issuedAt, expiresAt, signature] = parts;
  const payload = `${issuedAt}.${expiresAt}`;
  const expectedSignature = sign(payload, secret);
  if (signature.length !== expectedSignature.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return false;
  }
  const expires = Number(expiresAt);
  if (!Number.isFinite(expires)) return false;
  return Date.now() <= expires;
};

export const getSessionCookieName = () => SESSION_COOKIE;
