/* -------------------------------------------------------------------------- */
/*  Static demo authentication                                                */
/*                                                                            */
/*  There is no backend, so the credentials and the one-time passcode are     */
/*  fixed values. Nothing is stored: refreshing the page returns to sign-in.  */
/*  Set SHOW_DEMO_HINTS to false to hide the on-screen hints.                 */
/* -------------------------------------------------------------------------- */

export const DEMO_CREDENTIALS = {
  username: 'ibeh.chidera',
  password: 'ibeh@2026',
} as const;

export const DEMO_OTP = '482913';
export const OTP_LENGTH = DEMO_OTP.length;
export const MAX_OTP_ATTEMPTS = 3;
export const RESEND_COOLDOWN_SECONDS = 30;
export const SHOW_DEMO_HINTS = false;

export function checkCredentials(username: string, password: string): boolean {
  return (
    username.trim().toLowerCase() === DEMO_CREDENTIALS.username &&
    password === DEMO_CREDENTIALS.password
  );
}

export function checkOtp(code: string): boolean {
  return code === DEMO_OTP;
}

/** "ibehchristian819@gmail.com" -> "ib••••••@gmail.com" */
export function maskEmail(email: string): string {
  const [local = '', domain = ''] = email.split('@');
  return `${local.slice(0, 2)}••••••@${domain}`;
}

/** Simulated network latency so loading states are visible. */
export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
