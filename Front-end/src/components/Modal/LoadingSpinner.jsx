// components/LoadingSpinner.tsx
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-xl">
        <div className="relative w-16 h-16">
          {/* Spinner principal */}
          <div className="absolute w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
          
          {/* Spinner secundario (opcional) */}
          <div className="absolute w-3/4 border-4 border-blue-300 rounded-full h-3/4 animate-spin border-b-transparent" style={{ animationDirection: "reverse", top: "12.5%", left: "12.5%" }}></div>
          
          {/* Spinner terciario (opcional) */}
          <div className="absolute w-1/2 border-4 border-blue-200 rounded-full h-1/2 animate-spin border-t-transparent" style={{ top: "25%", left: "25%" }}></div>
        </div>
        
        {/* Texto de carga con animación */}
        <p className="mt-4 text-lg font-medium text-gray-700 animate-pulse">
          Cargando...
        </p>
        
        {/* Texto secundario opcional */}
        <p className="mt-1 text-sm text-gray-500">
          Por favor espere un momento
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;