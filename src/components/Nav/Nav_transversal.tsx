import { Link } from 'react-router-dom';

const NavTransversal = () => {
  return (
    <div className="w-64 bg-white shadow-md py-4 px-6">
      <h2 className="text-xl font-bold text-[#2e63a6] mb-8">DOCUMENTOS TRANSVERSALES</h2>
      <ul className="space-y-6">
        <li>
          <Link
            to="/normativa-legal"
            className="block  font-semibold text-gray-700 hover:text-white hover:bg-[#2e63a6]  py-2 px-4 rounded transition duration-300"
          >
            Normativa Legal
          </Link>
        </li>
        <li>
          <Link
            to="/organigrama"
            className="block  font-semibold text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            Organigrama
          </Link>
        </li>
        <li>
          <Link
            to="/mapa-de-procesos"
            className="block  font-semibold text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
           Mapa de Procesos
          </Link>
        </li>
        <li>
          <Link
            to="/politica-de-calidad"
            className="block  font-semibold text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            Política de Calidad
          </Link>
        </li>
        <li>
          <Link
            to="/riesgo-y-oportunidades"
            className="block font-semibold text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            Riesgo y Oportunidades
          </Link>
        </li>
        <li>
          <Link
            to="/join-commission"
            className="block  font-semibold text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
         Join Commission
          </Link>
        </li>
        <li>
          <Link
            to="/power-bi-indicadores"
            className="block  font-semibold text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            Power BI Indicadores
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default NavTransversal;
