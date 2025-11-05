interface EmptyStateProps {
  title?: string;
  description?: string;
  message?: string;
}

export default function EmptyState({ message = "No se encontraron resultados" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <svg
        className="w-16 h-16 md:w-20 md:h-20 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4"
        />
      </svg>
      <p className="mt-4 text-gray-500 text-sm md:text-base text-center px-4">{message}</p>
    </div>
  );
}

export { EmptyState };