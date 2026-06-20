"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Shield, BadgeCheck, Zap, type LucideIcon } from "lucide-react";

const features: { label: string; icon: LucideIcon; color: string }[] = [
  { label: "Secure payments", icon: Shield, color: "text-[#10b981]" },
  { label: "Verified freelancers", icon: BadgeCheck, color: "text-[#22c55e]" },
  { label: "Instant hiring", icon: Zap, color: "text-[#f59e0b]" },
];

export default function Hero() {
  const router = useRouter();
  const heroVideo = useRef<HTMLVideoElement>(null);

  // Angular ngAfterViewInit: configure + autoplay the hero video.
  useEffect(() => {
    const video = heroVideo.current;
    if (!video) return;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    video.load();
    video.play().catch((error) => console.error("Error playing video:", error));
  }, []);

  // Angular LoginService.isLoggedIn() === !!localStorage token.
  // Temporary until the real useAuth() arrives in Phase 4.
  const isLoggedIn = () =>
    typeof window !== "undefined" && !!localStorage.getItem("token");

  const onBrowseFreelancers = () => {
    router.push(isLoggedIn() ? "/browse-freelancers" : "/auth/sign-in");
  };

  const onBecomeFreelancer = () => {
    router.push(isLoggedIn() ? "/index" : "/auth/sign-in");
  };

  return (
    <section className="mx-auto w-full px-6 pb-16 pt-8 lg:px-10 lg:pt-12">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Left */}
        <div className="max-w-2xl pl-16 pr-16">
          <h1 className="leading-[0.98] tracking-[-0.03em] text-[#0f172a]" data-aos="zoom-in">
            <span className="block text-[52px] font-extrabold md:text-[68px]">Find Top</span>
            <span className="block text-[52px] font-extrabold md:text-[68px]">Freelancers</span>
            <span className="block text-[52px] font-extrabold md:text-[68px]">
              on <span className="text-[#16a34a]">FoundIt</span>
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-[20px] leading-9 text-slate-600" data-aos="fade-right">
            Browse thousands of expert freelancers. Hire instantly, collaborate easily, and pay
            securely — all in one platform.
          </p>

          <div
            className="mt-10 flex flex-col gap-4 sm:flex-row"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <button
              type="button"
              onClick={onBrowseFreelancers}
              className="inline-flex items-center active:opacity-30 justify-center gap-2 rounded-2xl bg-[#2563eb] px-8 py-4 text-lg font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.28)] transition hover:bg-[#1d4ed8]"
            >
              Browse Freelancers
              <svg className="h-5 w-5 mt-1" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4.167 10h11.666M10.833 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={onBecomeFreelancer}
              className="inline-flex items-center active:opacity-30 justify-center rounded-2xl bg-[#16a34a] px-8 py-4 text-lg font-semibold text-white shadow-[0_10px_24px_rgba(22,163,74,0.28)] transition hover:bg-[#15803d]"
            >
              Become a Freelancer
            </button>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.label}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600"
                >
                  <Icon size={16} className={feature.color} />
                  <span>{feature.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right */}
        <div className="relative mx-auto w-full max-w-4xl" data-aos="fade-left">
          <div className="absolute inset-4 rounded-[40px] bg-[#dff0e7] blur-[2px]"></div>
          <div className="relative overflow-visible rounded-[34px] bg-white/40 p-5">
            <div className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <video ref={heroVideo} className="w-full h-full object-cover md:h-screen">
                <source src="/assets/videos/landingGif.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
