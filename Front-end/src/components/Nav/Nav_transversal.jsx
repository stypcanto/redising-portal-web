import { Link } from "react-router-dom";

const NavTransversal = () => {
  return (
    <div className="flex flex-col w-full h-full p-4 mt-24 bg-white shadow-md sm:w-52 md:w-full lg:w-72 xl:w-80">
      <h2 className="text-sm font-bold text-[#2e63a6] mb-8 text-center">
        DOCUMENTOS TRANSVERSALES
      </h2>
      <ul className="flex-grow space-y-13">
        {[
          { name: "Normativa Legal", link: "https://segurosocialdesalud-my.sharepoint.com/:f:/g/personal/cenate_calidad_essalud_gob_pe/Eo9_43iqb1VNsch_hYtI92gBBOsuJI8QGgD-obgvozdS1A" },
          { name: "Organigrama", link: "https://segurosocialdesalud-my.sharepoint.com/:u:/g/personal/cenate_calidad_essalud_gob_pe/EROuZq9F0QZFmVTWFDSG7iwBdLZNxEGPanLXbZOr3vCjug?e=M5xvaB" },
          { name: "Mapa de Procesos", link: "https://segurosocialdesalud-my.sharepoint.com/:p:/g/personal/cenate_calidad_essalud_gob_pe/EXUOMgQ-lUdBvi8zHX5B_vMB0N8GJIlIQx4y0_4FOL7q2A?e=iWgGN7" },
          { name: "Política de Calidad", link: "https://segurosocialdesalud-my.sharepoint.com/:i:/g/personal/cenate_calidad_essalud_gob_pe/ES12n-8O6lpHgtDF-xK15REBbkXlyXVZPYjT-xoJ9lxYRg?e=9YbjDF" },
          { name: "Riesgo y Oportunidades", link: "https://segurosocialdesalud-my.sharepoint.com/:u:/g/personal/cenate_calidad_essalud_gob_pe/EUoOc6ZIhzFOvJLdXlYF_boBgovcGMgZNaUEbyM-UDp0Mg?e=3db9Te" },
          { name: "Join Commission", link: "https://segurosocialdesalud-my.sharepoint.com/:f:/g/personal/cenate_calidad_essalud_gob_pe/EkwKW8-lXHFPvb7pwYc2b-0BZP8obG8ISBSUylPqsbvtTA?e=pLRSCH" },
          { name: "Power BI", link: "https://app.powerbi.com/view?r=eyJrIjoiODA1OTUyOGItMTE4Zi00MTdiLWI4MjItMzlmYmY0OThhOGNhIiwidCI6IjM0ZjMyNDE5LTFjMDUtNDc1Ni04OTZlLTQ1ZDYzMzcyNjU5YiIsImMiOjR9" },
          { name: "Indicadores", link: "https://segurosocialdesalud-my.sharepoint.com/:x:/g/personal/cenate_calidad_essalud_gob_pe/ETHMxdNESGVOliHWPUb3c-gBv0gGMQR-WCuVucXPQCibIg?e=TkKlGi" },
        ].map(({ name, link }) => (
          <li key={name} className="w-full">
            <Link
              to={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-gray-700 border-b border-gray-300 hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300 text-center"
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
