import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-[#064E3B]/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 translate-x-1/2 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="min-h-[100dvh] flex flex-col relative z-0">
        <AdminNavbar />
        <main className="flex-1 w-full">{children}</main>
      </div>
    </>
  );
}
