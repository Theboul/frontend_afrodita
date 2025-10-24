import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ placeholder = "Buscar..." }: { placeholder?: string }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Buscando:", query);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center justify-center w-full max-w-md mx-auto"
    >
      <div className="relative w-full">
        {/* Ícono de búsqueda */}
        <Search className="absolute left-3 top-2.5 text-pink-400" size={20} />

        {/* Campo de búsqueda */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 text-gray-700 bg-white/90 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300 shadow-sm transition duration-200"
        />

        {/* Botón */}
        <button
          type="submit"
          className="absolute right-1 top-1 bottom-1 bg-gradient-to-r from-pink-400 to-pink-500 text-white text-sm px-4 rounded-full shadow-md hover:shadow-lg hover:from-pink-500 hover:to-pink-600 transition-all"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}