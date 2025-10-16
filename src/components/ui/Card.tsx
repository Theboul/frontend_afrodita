export default function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      {title && <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>}
      {children}
    </div>
  );
}
