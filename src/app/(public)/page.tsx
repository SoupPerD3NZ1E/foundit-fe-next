import Hero from "@/components/landing/Hero";
import PopularCategory from "@/components/landing/PopularCategory";
import HowItWork from "@/components/landing/HowItWork";
import WhyChooseFoundit from "@/components/landing/WhyChooseFoundit";
import LoveByBusiness from "@/components/landing/LoveByBusiness";
import StartEarning from "@/components/landing/StartEarning";
import StartYourProject from "@/components/landing/StartYourProject";

export default function Home() {
  return (
    <main>
      <Hero />
      <PopularCategory />
      <HowItWork />
      <WhyChooseFoundit />
      <LoveByBusiness />
      <StartEarning />
      <StartYourProject />
    </main>
  );
}
