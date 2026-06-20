'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/lib/api/auth';

export default function SignUpPage() {
  const { signUp, isLoading, errorMessage, setErrorMessage } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsDoNotMatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const validateForm = (): string | null => {
    if (!fullName.trim()) return 'Full name is required.';
    if (!email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return 'Enter a valid email address.';
    if (!password) return 'Password is required.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (!confirmPassword) return 'Please re-enter your password.';
    if (password !== confirmPassword)
      return 'Password and confirm password do not match.';
    if (!agreeTerms) return 'Please agree to the Terms and Privacy policy.';
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    await signUp({ username: fullName.trim(), email: email.trim(), password });
  };

  const continueWithGoogle = () => {
    if (email) localStorage.setItem('pending_email', email);
    authApi.continueWithGoogle();
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] px-6 py-8 md:px-10 lg:px-16">
      <div className="mx-auto w-full">
        <div className="flex justify-center mb-3">
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

        <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr]">
          {/* Left */}
          <div className="flex items-start justify-center px-2 pt-8 md:px-6 lg:px-4 xl:px-8">
            <div className="w-full max-w-2xl">
              <h1 className="text-[42px] font-bold leading-tight text-[#1b1b1b]">
                Create an account
              </h1>
              <p className="mt-2 text-[18px] text-[#7b7b7b]">Sign Up With FoundIT</p>

              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={continueWithGoogle}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#e3e3e3] bg-white text-[14px] font-medium text-[#222] transition hover:bg-gray-50"
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="h-4 w-4"
                  />
                  <span>Continue with Google</span>
                </button>
              </div>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#e5e5e5]"></div>
                <span className="text-[13px] text-[#8a8a8a]">or use email</span>
                <div className="h-px flex-1 bg-[#e5e5e5]"></div>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] text-[#991b1b]">
                    {errorMessage}
                  </div>
                )}

                {/* Full name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-[14px] font-medium text-[#6f6f6f]"
                  >
                    Full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    className="h-12 w-full rounded-xl border border-transparent bg-[#f1f1f3] px-4 text-[14px] text-[#222] outline-none placeholder:text-[#9ca3af] focus:border-[#11a63a] focus:bg-white"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[14px] font-medium text-[#6f6f6f]"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-transparent bg-[#f1f1f3] px-4 text-[14px] text-[#222] outline-none placeholder:text-[#9ca3af] focus:border-[#11a63a] focus:bg-white"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[14px] font-medium text-[#6f6f6f]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-xl border border-transparent bg-[#f1f1f3] px-4 pr-12 text-[14px] text-[#222] outline-none placeholder:text-[#9ca3af] focus:border-[#11a63a] focus:bg-white"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  {password && password.length < 8 && (
                    <p className="mt-2 text-[13px] text-[#dc2626]">
                      Password must be at least 8 characters.
                    </p>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-[14px] font-medium text-[#6f6f6f]"
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="h-12 w-full rounded-xl border border-transparent bg-[#f1f1f3] px-4 pr-12 text-[14px] text-[#222] outline-none placeholder:text-[#9ca3af] focus:border-[#11a63a] focus:bg-white"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  {passwordsDoNotMatch && (
                    <p className="mt-2 text-[13px] text-[#dc2626]">
                      Password and confirm password do not match.
                    </p>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 text-[14px] text-[#333]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span>Remember me</span>
                  </label>

                  <label className="flex items-center gap-2 text-[14px] text-[#333]">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span>
                      I agree to
                      <a href="#" className="text-[#2563eb] hover:underline">Terms</a>
                      &
                      <a href="#" className="text-[#2563eb] hover:underline">Privacy</a>
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mx-auto block h-12 w-full rounded-xl bg-[#08b239] text-[15px] font-semibold text-white transition hover:bg-[#069d32] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? 'Signing up...' : 'Sign up'}
                  </button>
                </div>

                {/* Bottom link */}
                <p className="text-center text-[14px] text-[#8a8a8a]">
                  Already have an account?
                  <Link href="/auth/sign-in" className="ml-1 text-[#2563eb] hover:underline">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {/* Right */}
          <div className="hidden lg:flex lg:border-l lg:border-gray-200">
            <div className="flex w-full items-center justify-center p-8">
              <Image
                src="/assets/images/auth.png"
                alt="auth"
                width={600}
                height={600}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
