import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="mx-auto flex w-full h-16 border-b border-b-gray-300 items-center justify-between px-6 py-4 lg:px-10 sticky top-0 z-50 bg-white">
      <div className="w-32 h-16 flex items-center">
        <Image
          src="/assets/images/logo.png"
          alt="FOUNDIT"
          width={128}
          height={64}
          className="object-contain"
        />
      </div>

      <nav className="flex items-center gap-6">
        <Link
          href="/auth/sign-in"
          className="text-sm font-medium active:opacity-30 text-slate-600 transition hover:text-slate-900"
        >
          Login
        </Link>

        <Link
          href="/auth/sign-up"
          className="rounded-lg bg-[#16a34a] px-5 py-2 text-sm active:opacity-30 font-semibold text-white shadow-sm transition hover:bg-[#15803d]"
        >
          Sign Up
        </Link>
      </nav>
    </header>
  );
}
