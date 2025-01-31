import { Link } from 'react-router-dom';
import Footer_azul from "../components/Footer/Footer_azul";
import Header_template from "../components/Header/Header_template";

const Home = () => {
  return (
    <div className="min-h-screen ">
      {/* Login Section */}
      <Header_template>
        <div className="flex justify-end p-4">
          <Link
            to="/Login"
            className="bg-white text-[#2e63a6] px-6 py-3 rounded transition duration-300 ease-in-out transform hover:bg-blue-400 hover:text-white hover:scale-110 shadow-lg"
          >
            Iniciar sesión
          </Link>
        </div>
      </Header_template>
      


  {/* Tarjeta de presentación */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-[#def4fe] shadow-lg rounded-2xl overflow-hidden flex flex-col md:flex-row items-center md:items-stretch">
        {/* Imagen - Ocupará toda la altura en pantallas grandes */}
        <div className="w-full md:w-1/3">
          <img 
            src="/images/CENATEANGULAR.png" 
            alt="Institución" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Contenido */}
        <div className="w-full text-justify  md:w-2/3 p-6 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[#2e63a6] mb-4">
            Centro Nacional de Telemedicina
          </h2>
          <p className="text-gray-700 leading-relaxed">
            El Centro Nacional de Telemedicina - CENATE, es el órgano prestador nacional desconcentrado del Seguro Social de Salud - EsSalud, responsable de brindar atenciones de salud a distancia en los componentes de promoción, prevención, recuperación y rehabilitación haciendo uso de tecnologías de la información y de la comunicación.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            Encargado de formular, proponer y evaluar las políticas, estrategias y normas de la Telesalud de EsSalud, CENATE impulsa la innovación en educación médica para una salud más accesible y humana.
          </p>
          
          {/* Botón opcional */}
          <div className="mt-6">
          <a 
          href="https://www.gob.pe/cenate" 
          target="_blank" 
          rel="noopener noreferrer"
           className="bg-[#2e63a6] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#1d4f8a] transition duration-300 inline-block"
          >
           Conoce más
            </a>
          </div>
        </div>
      </div>
    </div>
       
       
        <div className="max-w-7xl mx-auto mt-2">  
          <div>
          

        <h2 className="text-lg  px-2 sm:text-2xl font-bold text-[#2e63a6] mb-4 sm:mb-6">
  Sistema de Gestión de la Calidad
</h2>
<p className="text-lg sm:text-lg px-2 text-justify  text-gray-600 mb-6 sm:mb-8">
  En el Centro Nacional de Telemedicina, hemos incorporado la Política de Calidad de ESSALUD, aprobada el 21 de abril del 2022, a nuestro propio Sistema de Gestión de la Calidad.
</p>

<h2 className="text-lg sm:text-2xl  px-2 font-bold text-[#2e63a6] mb-4 sm:mb-6">
  ¿Qué es la Telesalud?
</h2>
<p className="text-lg sm:text-lg text-justify  px-2  text-gray-600 mb-6 sm:mb-8">
  Es un servicio de salud a distancia prestado por personal de la salud competente, quien hace uso de las Tecnologías de la Información y Comunicación (TIC), para lograr que estos servicios sean accesibles y oportunos a la población. La Telesalud se efectúa considerando los siguientes ejes de desarrollo:
</p>


          {/* Telegestión Section */}
          <div className="bg-blue-50 p-6 text-justify rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold text-[#2e63a6]">Telegestión</h3>
            <p className="text-lg text-gray-600">
              Aplicación de los principios, conocimientos y/o métodos de gestión de salud, mediante el uso de las TIC, en la planificación, organización, dirección y control de los servicios de salud.
            </p>
          </div>

          {/* TeleIEC Section */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold text-[#2e63a6]">Tele información, educación y comunicación (TeleIEC)</h3>
            <p className="text-lg text-gray-600 text-justify">
              Es la comunicación a distancia, mediante el uso de las TIC, que permite ampliar o precisar los conocimientos sobre salud, y está dirigido a la población en general o a un sector de esta, para difundir estilos de vida saludable, el cuidado de su salud, familia y comunidad.
            </p>
          </div>

          {/* Telecapacitación Section */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold text-[#2e63a6]">Telecapacitación</h3>
            <p className="text-lg text-gray-600 text-justify">
              Es el proceso de enseñanza/aprendizaje mediante el uso de las TIC, realizado por personal especializado con las competencias necesarias, orientado a ampliar los conocimientos, habilidades, destrezas, aptitudes y actitudes del personal de la salud.
            </p>
          </div>

          {/* Telemedicina Section */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-[#2e63a6]">Telemedicina</h3>
            <p className="text-lg text-gray-600 text-justify">
              Provisión de servicios de salud a distancia en los componentes de promoción, prevención, diagnóstico, tratamiento, recuperación, rehabilitación y cuidados paliativos, prestados por personal de la salud que utiliza las TIC, con el propósito de facilitar el acceso a los servicios de salud a la población.
            </p>
          </div>

          {/* Links for further information */}
          <div className="text-center mt-6">
  <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0 mb-14">
    <a href="https://www.gob.pe/52766-realizar-una-consulta-por-telemedicina"   target="_blank"  className="bg-[#2e63a6] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#1d4f8a] transition duration-300">
      Realizar una consulta por telemedicina
    </a>
    <a href="https://teleeduca.essalud.gob.pe/"   target="_blank"   className="bg-[#2e63a6] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#1d4f8a] transition duration-300">
      Programa “TELEEDUCA”
    </a>
    <a href="https://telecapacitaciones.essalud.gob.pe/"   target="_blank"  className="bg-[#2e63a6] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#1d4f8a] transition duration-300">
      Telecapacitaciones y TeleIEC
    </a>
  </div>
</div>

        </div>
      </div>

      {/* Footer */}
      <Footer_azul />
    </div>
  );
};

export default Home;
