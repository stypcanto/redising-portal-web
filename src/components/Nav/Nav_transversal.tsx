import { Link } from 'react-router-dom';

const NavTransversal = () => {
  return (
    <div
      className="w-full sm:w-52 md:w-full lg:w-72 xl:w-80 bg-white shadow-md py-4 px-6 transition-all duration-300"
      style={{ minHeight: 'auto' }} // Ajuste automático de altura
    >
      <h2 className="text-sm font-bold text-[#2e63a6] mb-8 sm:block md:text-center lg:text-left">
        DOCUMENTOS TRANSVERSALES
      </h2>

      <ul className="space-y-6 md:flex md:flex-wrap md:gap-4 md:justify-center lg:block">
        {[
          { name: "Normativa Legal", link: "" },
          { name: "Organigrama", link: "" },
          { name: "Mapa de Procesos", link: "" },
          { name: "Política de Calidad", link: "" },
          { name: "Riesgo y Oportunidades", link: "" },
          { name: "Join Commission", link: "" },
          { name: "Power BI", link: "https://app.powerbi.com/view?r=eyJrIjoiODA1OTUyOGItMTE4Zi00MTdiLWI4MjItMzlmYmY0OThhOGNhIiwidCI6IjM0ZjMyNDE5LTFjMDUtNDc1Ni04OTZlLTQ1ZDYzMzcyNjU5YiIsImMiOjR9" },
          { name: "Indicadores", link: "" }
        ].map(({ name, link }) => (
          <li key={name} className="w-full md:w-auto">
            <Link
              to={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm border-b-1 text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300 text-center md:text-left"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavTransversal;
