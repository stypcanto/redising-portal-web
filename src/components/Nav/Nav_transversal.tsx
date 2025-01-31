import { Link } from 'react-router-dom';

const NavTransversal = () => {
  return (
    <div className="w-64 bg-white shadow-md py-4 px-6">
      <h2 className="text-xl font-bold text-[#2e63a6] mb-8">DOCUMENTOS TRANSVERSALES</h2>
      <ul className="space-y-4">
        <li>
          <Link
            to="/normativa-legal"
            className="block text-lg font-semibold text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            NORMATIVA LEGAL
          </Link>
        </li>
        <li>
          <Link
            to="/organigrama"
            className="block text-lg font-semibold text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            ORGANIGRAMA
          </Link>
        </li>
        <li>
          <Link
            to="/mapa-de-procesos"
            className="block text-lg font-semibold text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            MAPA DE PROCESOS
          </Link>
        </li>
        <li>
          <Link
            to="/politica-de-calidad"
            className="block text-lg font-semibold text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            POLITICA DE CALIDAD
          </Link>
        </li>
        <li>
          <Link
            to="/riesgo-y-oportunidades"
            className="block text-lg font-semibold text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            RIESGO Y OPORTUNIDADES
          </Link>
        </li>
        <li>
          <Link
            to="/join-commission"
            className="block text-lg font-semibold text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            JOIN COMMISSION
          </Link>
        </li>
        <li>
          <Link
            to="/power-bi-indicadores"
            className="block text-lg font-semibold text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            POWER BI INDICADORES
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default NavTransversal;
