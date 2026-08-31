import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Top Atmospheric Ambient Glows */}
      <div className="fixed top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-[#E5A93C]/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-20 right-1/4 translate-x-1/2 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-1/3 w-80 h-80 bg-[#E5A93C]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="luxury-bg min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </div>
    </>
  );
}
