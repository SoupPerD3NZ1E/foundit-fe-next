'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Clock3, Shield, Check, Lock, Eye, EyeOff } from 'lucide-react';
import { forgetPasswordApi } from '@/lib/api/forgetPassword';

type ResetStep = 'email' | 'verify' | 'password' | 'done';

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const shouldShowEmailError = emailTouched && !isEmailValid;
  const isVerificationComplete = verificationCode.every((d) => d.trim() !== '');
  const isPasswordValid = password.trim().length >= 8;
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const onCodeInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 1);
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const onCodeKeydown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submit = async () => {
    if (isLoading) return;

    if (step === 'email') {
      setEmailTouched(true);
      if (!isEmailValid) return;
      setIsLoading(true);
      setErrorMessage('');
      setVerificationCode(['', '', '', '', '', '']);
      try {
        await forgetPasswordApi.sendCode({ email: email.trim() });
        setStep('verify');
      } catch {
        setErrorMessage('Failed to send verification code');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (step === 'verify') {
      if (!isVerificationComplete) return;
      setStep('password');
      return;
    }

    if (step === 'password') {
      if (!isPasswordValid || !doPasswordsMatch) return;
      setIsLoading(true);
      setErrorMessage('');
      try {
        await forgetPasswordApi.resetPassword({
          email: email.trim(),
          verifyCode: verificationCode.join(''),
          newPassword: password,
        });
        setStep('done');
      } catch {
        setErrorMessage('Failed to reset password');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resendCode = async () => {
    if (isLoading || !isEmailValid) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      await forgetPasswordApi.resendCode({ email: email.trim() });
    } catch {
      setErrorMessage('Failed to resend verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setStep('email');
    setEmailTouched(false);
    setVerificationCode(['', '', '', '', '', '']);
    setPassword('');
    setConfirmPassword('');
    setIsLoading(false);
    setErrorMessage('');
  };

  const backToSignIn = () => router.replace('/auth/sign-in');

  const isSubmitDisabled =
    isLoading ||
    (step === 'email' && !email.trim()) ||
    (step === 'verify' && !isVerificationComplete) ||
    (step === 'password' && !(isPasswordValid && doPasswordsMatch));

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-8 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl p-6">
        <div className="flex justify-center mb-6">
          <div className="w-32 h-16 flex items-center">
            <Image
              src="/assets/images/logo.png"
              alt="FOUNDIT"
              width={128}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left Side */}
          <div className="max-w-5xl">
            {step !== 'done' ? (
              <>
                <h2 className="text-[36px] font-semibold leading-tight text-[#111827]">
                  Reset your password
                </h2>

                {step === 'email' && (
                  <p className="mt-4 text-[18px] leading-8 text-[#6b7280]">
                    Enter your email and we'll send you a 6-digit verification code.
                  </p>
                )}
                {step === 'verify' && (
                  <p className="mt-4 text-[18px] leading-8 text-[#6b7280]">
                    Enter the 6-digit code sent to{' '}
                    <span className="font-medium text-[#111827]">{email.trim()}</span>.
                  </p>
                )}
                {step === 'password' && (
                  <p className="mt-4 text-[18px] leading-8 text-[#6b7280]">
                    Set a new password for{' '}
                    <span className="font-medium text-[#111827]">{email.trim()}</span>.
                  </p>
                )}

                {errorMessage && (
                  <p className="mt-4 rounded-2xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
                    {errorMessage}
                  </p>
                )}

                {/* Step 1: Email */}
                {step === 'email' && (
                  <div className="mt-10">
                    <label className="mb-2 block text-sm font-medium text-[#6b7280]">Email</label>
                    <div className={`flex h-14 items-center gap-3 rounded-2xl border bg-white px-4 shadow-sm ${shouldShowEmailError ? 'border-[#fca5a5]' : 'border-[#22c55e] focus-within:border-[#16a34a] focus-within:ring-2 focus-within:ring-[#22c55e]/20'}`}>
                      <Mail className="h-5 w-5 text-[#6b7280]" />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setEmailTouched(true)}
                        type="email"
                        placeholder="you@example.com"
                        className="h-full w-full border-0 bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
                      />
                    </div>
                    {shouldShowEmailError && (
                      <p className="mt-2 text-right text-sm text-[#ef4444]">Invalid email</p>
                    )}
                  </div>
                )}

                {/* Step 2: Verify */}
                {step === 'verify' && (
                  <div className="mt-10">
                    <label className="mb-4 block text-sm font-medium text-[#6b7280]">
                      Verification code
                    </label>
                    <div className="grid grid-cols-6 gap-3 sm:gap-4">
                      {verificationCode.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { inputRefs.current[i] = el; }}
                          value={digit}
                          onChange={(e) => onCodeInput(e, i)}
                          onKeyDown={(e) => onCodeKeydown(e, i)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          className="h-14 w-14 rounded-2xl border border-[#e5e7eb] bg-white text-center text-lg font-semibold text-[#111827] outline-none transition focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20"
                        />
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={resendCode}
                        disabled={isLoading}
                        className="text-sm font-medium text-[#16a34a] transition hover:text-[#15803d] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Resend code
                      </button>
                      <button
                        type="button"
                        onClick={resetFlow}
                        disabled={isLoading}
                        className="text-sm font-medium text-[#9ca3af] transition hover:text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Change email
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Password */}
                {step === 'password' && (
                  <div className="mt-10 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#6b7280]">Password</label>
                      <div className="flex h-13 items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-[#f3f4f6] px-4">
                        <Lock className="h-5 w-5 text-[#9ca3af]" />
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          className="h-full w-full border-0 bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#9ca3af] transition hover:text-[#6b7280]">
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#6b7280]">Confirm password</label>
                      <div className="flex h-13 items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-[#f3f4f6] px-4">
                        <Lock className="h-5 w-5 text-[#9ca3af]" />
                        <input
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Re-enter your password"
                          className="h-full w-full border-0 bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-[#9ca3af] transition hover:text-[#6b7280]">
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {confirmPassword && !doPasswordsMatch && (
                        <p className="mt-2 text-sm text-[#ef4444]">Passwords do not match</p>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={submit}
                  disabled={isSubmitDisabled}
                  className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[#0aad3b] px-4 text-sm font-medium text-white transition hover:bg-[#099132] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {step === 'email' && 'Send code'}
                  {step === 'verify' && 'Continue'}
                  {step === 'password' && 'Reset password'}
                </button>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={backToSignIn}
                    className="text-sm font-medium text-[#9ca3af] transition hover:text-[#6b7280]"
                  >
                    Back to sign in
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-[36px] font-semibold leading-tight text-[#111827]">
                  Password updated
                </h2>
                <p className="mt-4 text-[18px] leading-8 text-[#6b7280]">
                  Your password has been reset successfully. You can now sign in with your new password.
                </p>
                <button
                  type="button"
                  onClick={backToSignIn}
                  className="mt-8 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[#0aad3b] px-4 text-sm font-medium text-white transition hover:bg-[#099132]"
                >
                  Back to sign in
                </button>
                <button
                  type="button"
                  onClick={resetFlow}
                  className="mt-4 inline-flex h-14 w-full items-center justify-center rounded-2xl border border-[#d1d5db] bg-white px-4 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
                >
                  Start over
                </button>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="max-w-5xl lg:ml-auto">
            <h3 className="text-[40px] font-semibold leading-tight text-[#111827]">
              Secure & simple password reset
            </h3>
            <div className="mt-12 space-y-8">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0aad3b] text-white">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[24px] font-semibold text-[#111827]">Single-use secure links</h4>
                  <p className="mt-2 text-[16px] leading-7 text-[#374151]">
                    Each reset link works only once and expires after 15 minutes
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0aad3b] text-white">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[24px] font-semibold text-[#111827]">Your data is protected</h4>
                  <p className="mt-2 text-[16px] leading-7 text-[#374151]">
                    We never reveal if an email exists in our system
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0aad3b] text-white">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[24px] font-semibold text-[#111827]">Quick & easy</h4>
                  <p className="mt-2 text-[16px] leading-7 text-[#374151]">
                    Back in your account in under a minute
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-12 border-t border-[#9ca3af] pt-6">
              <p className="text-[16px] text-[#111827]">Need help? Contact support@marketplace.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
