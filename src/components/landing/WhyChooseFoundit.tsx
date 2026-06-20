import { BadgeCheck, Lock, MessageSquare, Clock3, type LucideIcon } from 'lucide-react';

const reasons: { title: string; description: string; icon: LucideIcon; boxClass: string }[] = [
  {
    title: 'Verified Freelancers',
    description: 'Every professional is thoroughly vetted.',
    icon: BadgeCheck,
    boxClass: 'bg-[#eaf7ef] text-[#16a34a]',
  },
  {
    title: 'Secure Escrow',
    description: 'Funds are held safely until work is approved.',
    icon: Lock,
    boxClass: 'bg-[#eaf7ef] text-[#16a34a]',
  },
  {
    title: 'Built-in Chat',
    description: 'Communicate & share files instantly.',
    icon: MessageSquare,
    boxClass: 'bg-[#f3e8ff] text-[#9333ea]',
  },
  {
    title: 'Fast Delivery',
    description: 'Agree on a deadline, get it done — on time, every time.',
    icon: Clock3,
    boxClass: 'bg-[#fff1e8] text-[#f97316]',
  },
];

export default function WhyChooseFoundit() {
  return (
    <section className="bg-[#f7f7f7] xl:py-20 lg:py-20 md:py-20 pl-16 pr-16">
      <div className="mx-auto grid grid-cols-1 w-full items-center gap-12 px-6 lg:grid-cols-2">

        {/* Left */}
        <div className="w-full">
          <h2 className="xl:text-[34px] lg:text-[34px] text-2xl font-extrabold leading-[1.05] tracking-[-0.03em] text-[#111827] md:text-[44px]">
            Why businesses choose
            <br />
            FoundIt
          </h2>

          <p className="mt-6 xl:text-[18px] lg:text-[18px] md:text-[18px] text-sm leading-8 text-[#6b7280]">
            We've built a platform that prioritizes trust, speed, and quality. Experience a
            frictionless hiring process designed for modern teams.
          </p>

          <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {reasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <div key={reason.title} data-aos="fade-right" className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${reason.boxClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="xl:text-[22px] lg:text-[22px] md:text-xl text-lg font-bold leading-7 text-[#111827]">
                      {reason.title}
                    </h3>
                    <p className="mt-1 xl:text-[15px] lg:text-[15px] md:text-lg text-sm leading-7 text-[#6b7280]">
                      {reason.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right */}
        <div className="relative mx-auto w-2xl">
          <div className="absolute hidden xl:block lg:block md:block -right-4 top-0 h-24 w-24 rounded-full bg-[#f4eaa4]"></div>
          <div className="absolute hidden xl:block lg:block md:block -left-5 bottom-12 h-36 w-36 rounded-3xl bg-[#d7f5df]"></div>

          <div
            className="relative overflow-hidden rounded-[20px] bg-white shadow-[0_26px_45px_rgba(15,23,42,0.16)]"
            data-aos="zoom-in-up"
          >
            <div className="hidden xl:flex xl:w-full xl:h-full lg:flex lg:h-96 lg:w-lg md:flex md:h-96 items-center justify-center">
              <img
                src="/foundit-logo.svg"
                alt="FoundIt logo"
                className="h-60 w-60 object-contain xl:h-72 xl:w-72"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
