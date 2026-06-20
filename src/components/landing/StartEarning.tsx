'use client';

import { useRouter } from 'next/navigation';
import { ArrowUpRight, CheckCircle2, PlusSquare } from 'lucide-react';

const benefits = [
  {
    title: 'Create unlimited gigs',
    description: 'List as many services as you want across different categories.',
  },
  {
    title: 'Set your own rates',
    description: 'You control your pricing and delivery timelines.',
  },
  {
    title: 'Get discovered by clients',
    description: 'Your gigs appear in search results and category pages.',
  },
  {
    title: 'Secure payments',
    description: 'Get paid on time with our escrow payment system.',
  },
];

export default function StartEarning() {
  const router = useRouter();

  const isLoggedIn = () =>
    typeof window !== 'undefined' && !!localStorage.getItem('token');

  const onPostFirstGig = () => {
    if (!isLoggedIn()) {
      router.push('/auth/sign-in');
      return;
    }
    router.push('/freelancer/create-new-service');
  };

  const onBrowseGigs = () => {
    router.push('/browse-gigs');
  };

  return (
    <section className="bg-[#f5f4fb] py-24 pl-16 pr-16">
      <div className="mx-auto grid w-full items-center gap-14 px-6 lg:grid-cols-2">

        {/* Left - mock card */}
        <div className="relative" data-aos="zoom-in-up">
          <div className="absolute right-2 top-0 z-20 flex items-center gap-3 rounded-[18px] bg-white px-5 py-4 shadow-[0_18px_38px_rgba(15,23,42,0.14)] md:right-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dcfce7] text-[#22c55e]">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[12px] text-[#8a8f98]">Avg. Earnings</p>
              <p className="text-[18px] font-extrabold text-[#111827]">
                $2,450<span className="text-[13px]">/mo</span>
              </p>
            </div>
          </div>

          <div className="rounded-[20px] bg-white p-6 shadow-[0_30px_55px_rgba(15,23,42,0.14)] md:p-7">
            <h3 className="text-[24px] font-extrabold text-[#111827]">Create Your Gig</h3>

            <div className="mt-6">
              <label className="mb-2 block text-[14px] font-medium text-[#374151]">Gig Title</label>
              <div className="flex h-[52px] items-center rounded-[12px] border border-[#e6e7eb] bg-[#f8f8fa] px-4 text-[15px] text-[#8a8f98]">
                I will design a modern UI/UX...
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#374151]">Price</label>
                <div className="flex h-[52px] items-center rounded-[12px] border border-[#e6e7eb] bg-[#f8f8fa] px-4 text-[15px] text-[#6b7280]">
                  $350
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#374151]">Delivery</label>
                <div className="flex h-[52px] items-center rounded-[12px] border border-[#e6e7eb] bg-[#f8f8fa] px-4 text-[15px] text-[#6b7280]">
                  3 days
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="h-[64px] rounded-[12px] bg-[#e6d8f3]"></div>
              <div className="h-[64px] rounded-[12px] bg-[#d8def8]"></div>
              <div className="h-[64px] rounded-[12px] bg-[#efd4e6]"></div>
            </div>

            <button className="mt-5 flex h-[54px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#4f46e5] text-[18px] font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.32)] transition hover:bg-[#4338ca]">
              <PlusSquare className="h-5 w-5" />
              Publish Gig
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="max-w-2xl" data-aos="zoom-in-up">
          <div className="inline-flex rounded-full bg-[#e1e4ff] px-4 py-1.5 text-[15px] font-medium text-[#4f46e5]">
            For Freelancers
          </div>

          <h2 className="mt-5 text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#111827] md:text-[52px]">
            Start earning by posting your gigs
          </h2>

          <p className="mt-6 text-[18px] leading-9 text-[#6b7280]">
            Showcase your skills, set your own prices, and connect with clients looking for your
            expertise. Join thousands of freelancers earning on FoundIt.
          </p>

          <div className="mt-8 space-y-5">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-3">
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#4f46e5]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#111827]">{benefit.title}</h3>
                  <p className="mt-1 text-[15px] leading-7 text-[#6b7280]">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={onPostFirstGig}
              className="flex h-[54px] items-center justify-center gap-2 rounded-[14px] bg-[#4f46e5] px-8 text-[18px] font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.32)] transition hover:bg-[#4338ca]"
            >
              <PlusSquare className="h-5 w-5" />
              Post Your First Gig
            </button>

            <button
              type="button"
              onClick={onBrowseGigs}
              className="h-[54px] rounded-[14px] border border-[#c7d2fe] bg-transparent px-8 text-[18px] font-semibold text-[#4f46e5] transition hover:bg-white"
            >
              Browse Gigs
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
