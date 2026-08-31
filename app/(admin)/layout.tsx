import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-[#FF0000]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 translate-x-1/2 w-80 h-80 bg-[#3D0000]/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="min-h-screen flex flex-col relative z-0">
        <AdminNavbar />
        <main className="flex-1 w-full">{children}</main>
      </div>
    </>
  );
}
