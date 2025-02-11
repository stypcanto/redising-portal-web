import React from "react";

interface CardProps {
  title: string;
  imageSrc: string;
  subtitle?: string;
  onClick: string; // `onClick` es una URL que se abre en una nueva pestaña
}

const Card: React.FC<CardProps> = ({ title, imageSrc, subtitle, onClick }) => {
  return (
    <div
   className="cursor-pointer rounded-lg shadow-lg bg-white hover:bg-[#0c63ab] hover:text-white hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300"
  onClick={() => window.open(onClick, "_blank")} // Abre el enlace en una nueva pestaña
>
      <img
        src={imageSrc}
        alt={title}
        className="  mt-4 w-20 h-20 object-cover rounded-t-lg mx-auto"
      />
      <div className="p-4">
      <h2 className="hover:text-white  text-l text-center font-inter font-semibold text-gray-800">{title}</h2>
    {subtitle && (
      <h3 className="hover:text-white  text-md text-center font-inter font-stretch-100% text-gray-800 mt-2">{subtitle}</h3>
    )}
      </div>
    </div>
  );
};

export default Card;

