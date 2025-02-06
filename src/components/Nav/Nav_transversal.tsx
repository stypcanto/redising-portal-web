import { Link } from 'react-router-dom';

const NavTransversal = () => {
  return (
    <div className="w-52 bg-white shadow-md py-4 px-6 ">
      <h2 className="text-sm font-bold text-[#2e63a6] mb-8">DOCUMENTOS TRANSVERSALES</h2>
      <ul className="space-y-6">
        <li>
          <Link
            to="https://segurosocialdesalud-my.sharepoint.com/:f:/g/personal/cenate_calidad_essalud_gob_pe/Eo9_43iqb1VNsch_hYtI92gBBOsuJI8QGgD-obgvozdS1A"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm border-b-1 text-gray-700 hover:text-white hover:bg-[#2e63a6]  py-2 px-4 rounded transition duration-300"
          >
            Normativa Legal
          </Link>
        </li>
        <li>
          <Link
            to="https://segurosocialdesalud-my.sharepoint.com/:u:/g/personal/cenate_calidad_essalud_gob_pe/EROuZq9F0QZFmVTWFDSG7iwBdLZNxEGPanLXbZOr3vCjug?e=M5xvaB"
            target="_blank"
            rel="noopener noreferrer"
            className="block  text-sm border-b-1 text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            Organigrama
          </Link>
        </li>
        <li>
          <Link
             to="https://segurosocialdesalud-my.sharepoint.com/:p:/g/personal/cenate_calidad_essalud_gob_pe/EXUOMgQ-lUdBvi8zHX5B_vMB0N8GJIlIQx4y0_4FOL7q2A?e=iWgGN7"
             target="_blank"
             rel="noopener noreferrer"
            className="block  text-sm border-b-1 text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
           Mapa de Procesos
          </Link>
        </li>
        <li>
          <Link
            
            to="https://segurosocialdesalud-my.sharepoint.com/:i:/g/personal/cenate_calidad_essalud_gob_pe/ES12n-8O6lpHgtDF-xK15REBbkXlyXVZPYjT-xoJ9lxYRg?e=9YbjDF
 "
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm  border-b-1 text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            Política de Calidad
          </Link>
        </li>
        <li>
          <Link
            to="https://segurosocialdesalud-my.sharepoint.com/:u:/g/personal/cenate_calidad_essalud_gob_pe/EUoOc6ZIhzFOvJLdXlYF_boBgovcGMgZNaUEbyM-UDp0Mg?e=3db9Te"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="block text-sm  border-b-1 text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
            
          >
            Riesgo y Oportunidades
          </Link>
        </li>
        <li>
          <Link
            to="https://segurosocialdesalud-my.sharepoint.com/:f:/g/personal/cenate_calidad_essalud_gob_pe/EkwKW8-lXHFPvb7pwYc2b-0BZP8obG8ISBSUylPqsbvtTA?e=pLRSCH"
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
            className="block  text-sm border-b-1   text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            Power BI
          </Link>
        </li>

        <li>
          <Link
            to="https://segurosocialdesalud-my.sharepoint.com/:x:/g/personal/cenate_calidad_essalud_gob_pe/ETHMxdNESGVOliHWPUb3c-gBv0gGMQR-WCuVucXPQCibIg?e=TkKlGi"
            target="_blank"
            rel="noopener noreferrer"
            className="block  text-sm border-b-1   text-gray-700 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
          >
            Indicadores
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default NavTransversal;
