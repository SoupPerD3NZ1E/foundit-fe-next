import { CodeXml, PanelsTopLeft, PenTool, Pencil, Video, Send, type LucideIcon } from 'lucide-react';

const categories: { title: string; subtitle: string; icon: LucideIcon }[] = [
  { title: 'Web Development', subtitle: 'React, Node, WordPress', icon: CodeXml },
  { title: 'UI/UX Design', subtitle: 'Web & Mobile Design', icon: PanelsTopLeft },
  { title: 'Logo Design', subtitle: 'Brand Identity', icon: PenTool },
  { title: 'Writing', subtitle: 'Copy & Content', icon: Pencil },
  { title: 'Video Editing', subtitle: 'Animation & Post', icon: Video },
  { title: 'Marketing', subtitle: 'SEO & Social Media', icon: Send },
];

export default function PopularCategory() {
  return (
    <section className="bg-[#f7f7f7] py-20 pl-16 pr-16">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 cursor-pointer">
        <div className="mx-auto w-full text-center">
          <h2
            className="text-[32px] font-extrabold tracking-[-0.03em] text-[#0f172a] md:text-[40px]"
            data-aos="zoom-in-up"
          >
            Browse by Popular Categories
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-[18px] leading-8 text-[#6b7280]"
            data-aos="fade-up-right"
          >
            Explore our diverse freelance marketplace to find top-tier professionals for any
            digital project.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                data-aos="flip-left"
                className="rounded-[22px] border border-[#e8e8ea] bg-white px-6 py-8 text-center shadow-[0_2px_8px_rgba(15,23,42,0.03)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf7ef]">
                  <Icon className="h-6 w-6 text-[#16a34a]" />
                </div>
                <div className="mt-5">
                  <h3 className="text-[16px] font-extrabold leading-7 text-[#111827]">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-[15px] leading-7 text-[#8b9099]">
                    {category.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
