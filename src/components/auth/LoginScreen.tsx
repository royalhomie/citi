import { useEffect, useRef, useState } from 'react';
import type { ClipboardEvent, FormEvent, KeyboardEvent } from 'react';
import {
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Mail,
  Info,
} from 'lucide-react';
import CitiLogo from '@/components/ui/CitiLogo';
import { USER } from '@/lib/user';
import {
  DEMO_CREDENTIALS,
  DEMO_OTP,
  OTP_LENGTH,
  MAX_OTP_ATTEMPTS,
  RESEND_COOLDOWN_SECONDS,
  SHOW_DEMO_HINTS,
  checkCredentials,
  checkOtp,
  maskEmail,
  wait,
} from '@/lib/auth';

interface LoginScreenProps {
  onAuthenticated: () => void;
}

type Step = 'credentials' | 'otp';

const inputClass =
  'w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-citi-500/40 focus:border-citi-500';

const primaryButtonClass =
  'w-full py-3.5 bg-citi-600 hover:bg-citi-700 disabled:opacity-60 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2';

export default function LoginScreen({ onAuthenticated }: LoginScreenProps) {
  const [step, setStep] = useState<Step>('credentials');

  // Credentials step
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP step
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [attempts, setAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resent, setResent] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resend countdown
  useEffect(() => {
    if (step !== 'otp' || cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, cooldown]);

  // Focus the first OTP box when the step opens
  useEffect(() => {
    if (step === 'otp') inputsRef.current[0]?.focus();
  }, [step]);

  /* ------------------------------ Step 1 ---------------------------------- */

  const handleCredentials = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      return setError('Enter your username and password');
    }

    setLoading(true);
    await wait(900); // "Verifying" + "Sending code"
    setLoading(false);

    if (!checkCredentials(username, password)) {
      setPassword('');
      return setError('Incorrect username or password');
    }

    setDigits(Array(OTP_LENGTH).fill(''));
    setAttempts(0);
    setCooldown(RESEND_COOLDOWN_SECONDS);
    setResent(false);
    setStep('otp');
  };

  /* ------------------------------ Step 2 ---------------------------------- */

  const setDigitAt = (index: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleDigitChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    setError(null);
    setDigitAt(index, digit);
    if (digit && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleDigitKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    setError(null);
    setDigits(Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] ?? ''));
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = digits.join('');
    if (code.length < OTP_LENGTH) return setError(`Enter the ${OTP_LENGTH}-digit code`);

    setLoading(true);
    await wait(700);
    setLoading(false);

    if (checkOtp(code)) {
      onAuthenticated();
      return;
    }

    const used = attempts + 1;
    setAttempts(used);
    setDigits(Array(OTP_LENGTH).fill(''));

    if (used >= MAX_OTP_ATTEMPTS) {
      // Too many wrong codes: send the user back to the start.
      setPassword('');
      setStep('credentials');
      setError('Too many incorrect codes. Please sign in again.');
      return;
    }

    setError(`Incorrect code. ${MAX_OTP_ATTEMPTS - used} attempt${MAX_OTP_ATTEMPTS - used === 1 ? '' : 's'} left.`);
    inputsRef.current[0]?.focus();
  };

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;
    setError(null);
    setLoading(true);
    await wait(600);
    setLoading(false);
    setDigits(Array(OTP_LENGTH).fill(''));
    setCooldown(RESEND_COOLDOWN_SECONDS);
    setResent(true);
    inputsRef.current[0]?.focus();
  };

  const backToCredentials = () => {
    setError(null);
    setPassword('');
    setStep('credentials');
  };

  /* ------------------------------- Render --------------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-citi-950 via-citi-900 to-citi-800 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-citi-500/10" />
      <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-citi-500/10" />

      <div className="relative w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <CitiLogo size={44} variant="light" />
          <div className="text-white">
            <p className="font-bold text-xl leading-tight">Citibank</p>
            <p className="text-xs text-citi-300">Mobile Banking</p>
          </div>
        </div>

        <div key={step} className="bg-white rounded-3xl p-6 sm:p-8 card-shadow-lg animate-scale-in">
          {step === 'credentials' ? (
            <form onSubmit={handleCredentials} className="space-y-4" noValidate>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Welcome back</h1>
                <p className="text-sm text-slate-500 mt-1">Sign in to access your accounts.</p>
              </div>

              <div>
                <label htmlFor="username" className="text-xs font-medium text-slate-500 mb-2 block">
                  Username
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    autoCapitalize="none"
                    autoFocus
                    placeholder="Enter your username"
                    className={`${inputClass} pl-11 pr-4`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-xs font-medium text-slate-500 mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={`${inputClass} pl-11 pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div role="alert" className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl font-medium">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className={primaryButtonClass}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  'Continue'
                )}
              </button>

              {SHOW_DEMO_HINTS && (
                <div className="bg-citi-50 rounded-xl p-4 flex items-start gap-3">
                  <Info className="w-4 h-4 text-citi-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-citi-900 leading-relaxed">
                    <p>
                      Username: <span className="font-mono font-medium">{DEMO_CREDENTIALS.username}</span>
                    </p>
                    <p>
                      Password: <span className="font-mono font-medium">{DEMO_CREDENTIALS.password}</span>
                    </p>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4" noValidate>
              <button
                type="button"
                onClick={backToCredentials}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors -mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <div>
                <div className="w-12 h-12 rounded-2xl bg-citi-50 text-citi-600 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">Verify it's you</h1>
                <p className="text-sm text-slate-500 mt-1">
                  We sent a {OTP_LENGTH}-digit code to{' '}
                  <span className="font-medium text-slate-700">{maskEmail(USER.email)}</span>.
                </p>
              </div>

              <div className="flex justify-between gap-2" role="group" aria-label="One-time passcode">
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputsRef.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleDigitKeyDown(i, e)}
                    onPaste={handlePaste}
                    onFocus={(e) => e.target.select()}
                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                    aria-label={`Digit ${i + 1}`}
                    className={`${inputClass} px-0 h-14 text-center text-xl font-bold tabular-nums ${
                      error ? 'border-red-300' : ''
                    }`}
                  />
                ))}
              </div>

              {resent && !error && (
                <p className="text-xs text-emerald-600 font-medium">A new code has been sent.</p>
              )}

              {error && (
                <div role="alert" className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl font-medium">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className={primaryButtonClass}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  'Verify & Sign In'
                )}
              </button>

              <div className="text-center text-xs text-slate-500">
                Didn't get it?{' '}
                {cooldown > 0 ? (
                  <span className="text-slate-400">Resend in {cooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="text-citi-600 font-medium hover:text-citi-700 transition-colors"
                  >
                    Resend code
                  </button>
                )}
              </div>

              {SHOW_DEMO_HINTS && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <p>
                      Your Citi verification code is{' '}
                      <span className="font-mono font-bold text-slate-900">{DEMO_OTP}</span>. Never share it.
                    </p>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
