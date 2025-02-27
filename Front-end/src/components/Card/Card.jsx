import React from "react";

const Card = ({ title, imageSrc, subtitle, onClick }) => {
  const handleClick = () => {
    if (onClick && typeof onClick === "string") {
      window.open(onClick, "_blank");
    }
  };

  return (
    <div
      className="cursor-pointer rounded-lg shadow-lg bg-white hover:bg-[#0c63ab] hover:text-white hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300"
      onClick={handleClick}
    >
      <img
        src={imageSrc}
        alt={title}
        className="object-cover mx-auto mt-4 rounded-t-lg w-15 h-15"
      />
      <div className="p-4">
        <h2 className="font-semibold text-center text-gray-800 hover:text-white text-l font-inter">{title}</h2>
        {subtitle && (
          <h3 className="hover:text-white text-md text-center font-inter font-stretch-100% text-gray-800 mt-2">{subtitle}</h3>
        )}
      </div>
    </div>
  );
};

export default Card;
