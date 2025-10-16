export default function ModuleLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FDF2F6] flex flex-col">
      <header className="bg-[#F4AFCC] text-black p-6 shadow-md">
        <h1 className="text-3xl font-bold">{title}</h1>
      </header>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
