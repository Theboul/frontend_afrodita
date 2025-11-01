interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Cargando..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
      <p className="mt-4 text-pink-600 text-sm md:text-base">{message}</p>
    </div>
  );
}