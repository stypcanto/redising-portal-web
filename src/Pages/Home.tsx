import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Login Section */}
      <div className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h2 className="text-xl font-bold">Centro Nacional de Telemedicina – CENATE</h2>
          <p className="text-lg">En CENATE humanizamos la tecnología para brindar salud.</p>
          <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded">
            Iniciar sesión
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-center text-blue-800 mb-8">CENATE</h1>
          <p className="text-lg text-gray-600 mb-8">
            Somos el Centro Nacional de Telemedicina (CENATE), órgano prestador nacional desconcentrado del Seguro Social de Salud - ESSALUD, bajo la supervisión directa de la Gerencia General. Asimismo, somos el primer establecimiento de salud virtual del país. Nuestra finalidad es brindar servicios Telesalud en el ámbito institucional, en los componentes de promoción, prevención, recuperación y rehabilitación, con soporte en tecnologías de la información y comunicación, para facilitar el acceso de la población asegurada y sus derechohabientes a servicios de salud en sus respectivas áreas geográficas.
          </p>

          <h2 className="text-2xl font-bold text-blue-800 mb-6">Sistema de Gestión de la Calidad</h2>
          <p className="text-lg text-gray-600 mb-8">
            En el Centro Nacional de Telemedicina, hemos incorporado la Política de Calidad de ESSALUD, aprobada el 21 de abril del 2022, a nuestro propio Sistema de Gestión de la Calidad.
          </p>

          <h2 className="text-2xl font-bold text-blue-800 mb-6">¿Qué es la Telesalud?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Es un servicio de salud a distancia prestado por personal de la salud competente, quien hace uso de las Tecnologías de la Información y Comunicación (TIC), para lograr que estos servicios sean accesibles y oportunos a la población. La Telesalud se efectúa considerando los siguientes ejes de desarrollo:
          </p>

          {/* Telegestión Section */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold text-blue-800">Telegestión</h3>
            <p className="text-lg text-gray-600">
              Aplicación de los principios, conocimientos y/o métodos de gestión de salud, mediante el uso de las TIC, en la planificación, organización, dirección y control de los servicios de salud.
            </p>
          </div>

          {/* TeleIEC Section */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold text-blue-800">Tele información, educación y comunicación (TeleIEC)</h3>
            <p className="text-lg text-gray-600">
              Es la comunicación a distancia, mediante el uso de las TIC, que permite ampliar o precisar los conocimientos sobre salud, y está dirigido a la población en general o a un sector de esta, para difundir estilos de vida saludable, el cuidado de su salud, familia y comunidad.
            </p>
          </div>

          {/* Telecapacitación Section */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold text-blue-800">Telecapacitación</h3>
            <p className="text-lg text-gray-600">
              Es el proceso de enseñanza/aprendizaje mediante el uso de las TIC, realizado por personal especializado con las competencias necesarias, orientado a ampliar los conocimientos, habilidades, destrezas, aptitudes y actitudes del personal de la salud.
            </p>
          </div>

          {/* Telemedicina Section */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-blue-800">Telemedicina</h3>
            <p className="text-lg text-gray-600">
              Provisión de servicios de salud a distancia en los componentes de promoción, prevención, diagnóstico, tratamiento, recuperación, rehabilitación y cuidados paliativos, prestados por personal de la salud que utiliza las TIC, con el propósito de facilitar el acceso a los servicios de salud a la población.
            </p>
          </div>

          {/* Links for further information */}
          <div className="text-center">
            <Link to="/consulta-telemedicina" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">
              Realizar una consulta por telemedicina
            </Link>
            <Link to="/teleeduca" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block ml-4">
              Programa “TELEEDUCA”
            </Link>
            <Link to="/telecapacitacion" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block ml-4">
              Telecapacitaciones y TeleIEC
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-4">
        <p>&copy; 2025 CENATE. Todos los derechos reservados.</p>
        <div className="mt-4 text-sm">
          <p>Diseñado y desarrollado por <span className="font-semibold">Equipo de Gestión TI</span>.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
