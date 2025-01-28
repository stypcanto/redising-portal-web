import { Link } from 'react-router-dom';

const Home = () => {
    return (
      <div className="flex flex-col h-screen">
  
        {/* Login Section */}
        <div className="bg-blue-600 text-white p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h2 className="text-xl font-bold">Centro Nacional de Telemedicina – CENATE</h2>
            
            <Link to="/">
              <button className="bg-white text-blue-600 px-4 py-2 rounded shadow-lg hover:bg-blue-200 transition duration-300">Cerrar sesión</button>
            </Link>
          </div>
        </div>
  
        {/* Main Content */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 flex-grow">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-semibold text-blue-800 mb-8">Bienvenido al Portal de Datos del CENATE</h1>
          
  
            {/* Botones de Navegación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Link to="/medicos" className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                <h3 className="text-xl font-semibold text-blue-800">Información para Médicos</h3>
              </Link>
              <Link to="/institucional" className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                <h3 className="text-xl font-semibold text-blue-800">Información Institucional</h3>
              </Link>
              <Link to="/telegestion" className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                <h3 className="text-xl font-semibold text-blue-800">Telegestión</h3>
              </Link>
              <Link to="/coordinadores" className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                <h3 className="text-xl font-semibold text-blue-800">Coordinadores de Telemedicina</h3>
              </Link>
              <Link to="/herramientas" className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                <h3 className="text-xl font-semibold text-blue-800">Herramientas para el Desarrollo de Telemedicina</h3>
              </Link>
              <Link to="/gestion-citas" className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                <h3 className="text-xl font-semibold text-blue-800">Gestión de Citas</h3>
              </Link>
              <Link to="/gestion" className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                <h3 className="text-xl font-semibold text-blue-800">Gestión</h3>
              </Link>
              <Link to="/telecapacitacion" className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                <h3 className="text-xl font-semibold text-blue-800">Telecapacitación</h3>
              </Link>
              <Link to="/teleiec" className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                <h3 className="text-xl font-semibold text-blue-800">TeleIEC</h3>
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
  