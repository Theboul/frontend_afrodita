import React from "react";

interface BannerProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageSrc: string; // ahora es obligatorio
}

const Banner: React.FC<BannerProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  imageSrc
}) => {
  return (
    <div
      className="w-full h-64 sm:h-80 md:h-96 bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${imageSrc})` }}
    >
      {/* Overlay oscuro para que el texto resalte */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Contenido del banner */}
      <div className="relative text-center text-white px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{title}</h1>
        {subtitle && <p className="text-lg sm:text-xl mb-4">{subtitle}</p>}
        {ctaText && ctaLink && (
          <a
            href={ctaLink}
            className="bg-pink-300 hover:bg-pink-400 text-white px-6 py-2 rounded-full font-medium transition"
          >
            {ctaText}
          </a>
        )}
      </div>
    </div>
  );
};

export default Banner;