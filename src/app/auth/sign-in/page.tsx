'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/lib/api/auth';

export const dynamic = 'force-dynamic';

function SignInContent() {
  const { login, isLoading, errorMessage } = useAuth();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
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

        <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-[#f8f8f8] lg:grid-cols-2">
          {/* Left */}
          <div className="flex items-center justify-center px-4 py-6 sm:px-8 md:px-12 lg:px-14">
            <div className="w-full max-w-2xl">
              <h2 className="mb-2 text-[42px] font-bold leading-tight text-gray-900">
                Welcome back
              </h2>
              <p className="mb-8 text-[18px] text-gray-500">Sign in to continue</p>

              {errorMessage && (
                <div className="mb-5 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm font-medium text-[#dc2626]">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={continueWithGoogle}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="h-4 w-4"
                  />
                  <span>Continue with Google</span>
                </button>
              </div>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200"></div>
                <span className="text-sm text-gray-400">or use email</span>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-transparent bg-[#f1f1f3] px-4 text-sm outline-none placeholder:text-gray-400 focus:border-[#16a34a] focus:bg-white"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                      Password
                    </label>
                    <Link
                      href="/auth/forget-password"
                      className="text-sm font-medium text-blue-500 hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-xl border border-transparent bg-[#f1f1f3] px-4 pr-12 text-sm outline-none placeholder:text-gray-400 focus:border-[#16a34a] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 w-full rounded-xl bg-[#08b239] text-sm font-semibold text-white transition hover:bg-[#069d32] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>

                <p className="pt-2 text-center text-sm text-gray-500">
                  New here?{' '}
                  <Link href="/auth/sign-up" className="font-medium text-blue-500 hover:underline">
                    Create account
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

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}
