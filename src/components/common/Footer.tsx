export default function Footer() {
  return (
    <footer className="bg-[#FF84AF] py-4">
      <div className="container mx-auto px-4 text-center text-white text-sm">
        © {new Date().getFullYear()} Afrodita Lentes — Todos los derechos reservados.
      </div>
    </footer>
  );
}
