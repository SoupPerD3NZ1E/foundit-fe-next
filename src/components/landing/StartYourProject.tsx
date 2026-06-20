'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StartYourProject() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<'hire' | 'freelancer'>('hire');

  const isLoggedIn = () =>
    typeof window !== 'undefined' && !!localStorage.getItem('token');

  const selectOption = (option: 'hire' | 'freelancer') => {
    setSelectedOption(option);

    if (!isLoggedIn()) {
      router.push('/auth/sign-in');
      return;
    }

    if (option === 'hire') {
      router.push('/browse-freelancers');
      return;
    }

    router.push('/index');
  };

  const activeClass =
    'rounded-xl bg-white px-7 py-3 text-[16px] font-semibold text-[#0f8f3a] shadow-md transition hover:shadow-lg cursor-pointer';
  const inactiveClass =
    'rounded-xl border border-white px-7 py-3 text-[16px] font-semibold text-white transition hover:bg-white hover:text-[#0f8f3a] cursor-pointer';

  return (
    <section className="bg-[#0f8f3a] py-20">
      <div className="mx-auto full px-6 text-center text-white">

        <h2 className="text-[36px] font-extrabold leading-tight md:text-[44px]">
          Ready to start your next project?
        </h2>

        <p className="mx-auto mt-6 xl:w-full lg:w-full md:w-full w-sm text-[18px] leading-8 text-[#d7f5df]">
          Join thousands of users who have successfully collaborated on our freelance marketplace.
          Browse top freelancers or create your professional profile today.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => selectOption('hire')}
            className={selectedOption === 'hire' ? activeClass : inactiveClass}
          >
            Hire Freelancers
          </button>

          <button
            onClick={() => selectOption('freelancer')}
            className={selectedOption === 'freelancer' ? activeClass : inactiveClass}
          >
            Become a Freelancer
          </button>
        </div>

      </div>
    </section>
  );
}
