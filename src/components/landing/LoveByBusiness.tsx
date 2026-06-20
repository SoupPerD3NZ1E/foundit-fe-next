import { Star, StarOff } from 'lucide-react';

const testimonials = [
  {
    quote: '"FoundIt made hiring a freelance developer incredibly easy. We launched our MVP three weeks ahead of schedule!"',
    name: 'Sarah T.',
    role: 'Startup Founder',
  },
  {
    quote: '"The graphic design freelancers here are top-notch. The secure payment system gave us complete peace of mind."',
    name: 'James W.',
    role: 'Marketing Director',
  },
  {
    quote: '"From finding talent to tracking deliveries, this freelance marketplace has the best project management tools built-in."',
    name: 'Anita P.',
    role: 'E-commerce Owner',
  },
];

export default function LoveByBusiness() {
  return (
    <section className="bg-[#f7f7f7] py-24 pl-16 pr-16">
      <div className="mx-auto w-full px-6">
        <div className="text-center">
          <h2 className="text-[34px] font-extrabold tracking-[-0.03em] text-[#111827] md:text-[48px]">
            Loved by businesses worldwide
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              data-aos="fade-right"
              className="rounded-[20px] bg-[#f1f2f4] px-6 py-7"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#f4c20d] text-[#f4c20d]" />
                  ))}
                </div>
                <StarOff className="h-6 w-6 text-[#9ff0bf]" />
              </div>

              <p className="mt-6 text-[16px] italic leading-10 text-[#4b5563] md:text-[17px]">
                {testimonial.quote}
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full border border-[#e5e7eb] bg-[#f8f8f8] shadow-[0_4px_10px_rgba(15,23,42,0.08)]"></div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#111827]">{testimonial.name}</h3>
                  <p className="text-[15px] text-[#8a8f98]">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
