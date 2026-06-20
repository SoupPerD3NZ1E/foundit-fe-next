import { Search, Briefcase, ShieldCheck, type LucideIcon } from 'lucide-react';

const steps: { step: string; title: string; description: string; icon: LucideIcon }[] = [
  {
    step: 'STEP 01',
    title: 'Browse Freelancers',
    description: 'Explore thousands of expert freelancer profiles across categories like design, development, writing, and more.',
    icon: Search,
  },
  {
    step: 'STEP 02',
    title: 'Hire Instantly',
    description: 'Review profiles, compare fixed-price services, and send a hire request with one click.',
    icon: Briefcase,
  },
  {
    step: 'STEP 03',
    title: 'Pay & Get Delivered',
    description: "Use secure escrow payment. Release funds only when you're 100% satisfied with the delivery.",
    icon: ShieldCheck,
  },
];

export default function HowItWork() {
  return (
    <section className="bg-[#f7f7f7] py-24 pl-16 pr-16">
      <div className="mx-auto w-full px-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-[36px] font-extrabold text-[#0f172a]" data-aos="zoom-in-up">
            How FoundIt Works
          </h2>
          <p className="mt-4 text-[18px] text-[#6b7280] leading-8" data-aos="fade-up-right">
            Getting your project done is simpler than ever. Hire top freelancers in three easy steps.
          </p>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-12 text-center">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} data-aos="zoom-out-up" className="relative">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-lg">
                  <Icon className="h-8 w-8" />
                </div>
                <p className="mt-6 text-[13px] font-semibold tracking-[2px] text-[#16a34a]">
                  {step.step}
                </p>
                <h3 className="mt-2 text-[20px] font-bold text-[#111827]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[16px] text-[#6b7280] leading-7">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
