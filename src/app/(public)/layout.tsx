import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Route-group layout for public/marketing pages.
// Wraps landing + other public routes with the shared Header/Footer.
// (auth pages live outside this group, so they render full-screen.)
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
