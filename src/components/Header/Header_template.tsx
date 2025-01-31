import { ReactNode } from 'react';

interface HeaderTemplateProps {
  children?: ReactNode;
}

const Header_template = ({ children }: HeaderTemplateProps) => {
  return (
    <div className="bg-[#2e63a6] text-white w-full h-auto">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <div className="text-center">
          <img
            src="/images/LOGOESSALUD.png"
            alt="Centro Nacional de Telemedicina - CENATE"
            className="mx-auto w-40  h-auto"
          />
        </div>
        {/* Aquí se renderiza el botón de cierre de sesión o cualquier otro contenido dinámico */}
        {children && <div className="flex items-center">{children}</div>}
      </div>
    </div>
  );
};

export default Header_template;
