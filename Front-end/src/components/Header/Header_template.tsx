import { ReactNode } from 'react';

interface HeaderTemplateProps {
  children?: ReactNode;
}

const Header_template = ({ children }: HeaderTemplateProps) => {
  return (
    <div className="bg-[#0a5ba9] text-white w-full h-auto border-b-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-1 flex-row sm:flex-row">
        <div className="text-center mb-2 sm:mb-0">
          <img
            src="/images/LOGOESSALUD.png"
            alt="Centro Nacional de Telemedicina - CENATE"
            className="mx-auto sm:w-40 h-auto w-22 ml-2"
          />
        </div>
        {/* Aquí se renderiza el botón de cierre de sesión o cualquier otro contenido dinámico */}
        {children && (
          <div className="flex items-center mt-2 sm:mt-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header_template;
