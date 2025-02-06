import { Link } from 'react-router-dom';

const NavTransversal = () => {
  return (
    <div
      className="w-full sm:w-52 md:w-64 lg:w-72 xl:w-80 bg-white shadow-md py-4 px-6 transition-all duration-300"
      style={{ minHeight: 'auto' }} // Ajuste automático de altura
    >
      <h2 className="text-sm font-bold text-[#2e63a6] mb-8 sm:block">DOCUMENTOS TRANSVERSALES</h2>

      <ul className="space-y-6">
        <li>
          <Link
            to=""
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm border-b-1 text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            Normativa Legal
          </Link>
        </li>
        <li>
          <Link
            to=""
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm border-b-1 text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            Organigrama
          </Link>
        </li>
        <li>
          <Link
            to=""
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm border-b-1 text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            Mapa de Procesos
          </Link>
        </li>
        <li>
          <Link
            to=""
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm border-b-1 text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            Política de Calidad
          </Link>
        </li>
        <li>
          <Link
            to=""
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm border-b-1 text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            Riesgo y Oportunidades
          </Link>
        </li>
        <li>
          <Link
            to=""
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm border-b-1 text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            Join Commission
          </Link>
        </li>
        <li>
          <Link
            to="https://app.powerbi.com/view?r=eyJrIjoiODA1OTUyOGItMTE4Zi00MTdiLWI4MjItMzlmYmY0OThhOGNhIiwidCI6IjM0ZjMyNDE5LTFjMDUtNDc1Ni04OTZlLTQ1ZDYzMzcyNjU5YiIsImMiOjR9"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm border-b-1 text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            Power BI
          </Link>
        </li>
        <li>
          <Link
            to=""
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm border-b-1 text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            Indicadores
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default NavTransversal;

