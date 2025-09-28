import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-[#FF84AF] py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-white">Afrodita Tu Amiga</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-white hover:underline">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/registro" className="text-white hover:underline">
                Registro
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-white hover:underline">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
