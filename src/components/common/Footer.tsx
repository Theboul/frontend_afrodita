import React from "react";
import { Mail, MapPin, Phone, Facebook, Instagram, X } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-pink-200 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Columna: Help & Support */}
        <div>
          <h3 className="text-lg font-semibold text-[#F4AFCC] mb-4">Help & Support</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={18} className="text-[#F4AFCC]" />
              <span>Santa Cruz de la Sierra, Bolivia</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} className="text-[#F4AFCC]" />
              <span>(+591) 700-12345</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} className="text-[#F4AFCC]" />
              <span>soporte@afrodita.com</span>
            </li>
          </ul>

          <div className="flex gap-4 mt-5">
            <a href="#" className="hover:text-[#F4AFCC] transition"><Facebook size={18} /></a>
            <a href="#" className="hover:text-[#F4AFCC] transition"><Instagram size={18} /></a>
            <a href="#" className="hover:text-[#F4AFCC] transition"><X size={18} /></a>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="border-t border-pink-100 mt-6 py-4 text-center text-xs text-gray-500">
        © 2025 <span className="text-[#F4AFCC] font-semibold">Afrodita</span>. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;