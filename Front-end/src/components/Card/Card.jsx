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
        className="object-cover mx-auto mt-2 rounded-t-lg w-18 h-18"
      />
      <div className="p-4">
        <h2 className="text-xs font-semibold text-center text-gray-800 hover:text-white font-inter">{title}</h2>
        {/*subtitle && (
          <h3 className="hover:text-white text-sm text-center font-inter font-stretch-100% text-gray-800 mt-1">{subtitle}</h3>
        )*/}
      </div>   
    </div>
  );
};

export default Card;
