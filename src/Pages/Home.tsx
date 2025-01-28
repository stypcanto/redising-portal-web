import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Login Section */}
      <div className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h2 className="text-xl font-bold">Bienvenido a CENATE</h2>
          <button className="bg-white text-blue-600 px-4 py-2 rounded">Iniciar sesión</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-center text-blue-800 mb-8">IPRESS CENATE</h1>
          <h2 className="text-2xl font-medium text-center text-gray-600 mb-12">CENATE GESTIÓN</h2>

          <nav className="space-y-6 text-center">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <li className="bg-blue-50 p-6 rounded-lg shadow-md hover:bg-blue-100 transition">
                <Link to="/medicos" className="text-xl text-blue-600">Información para Médicos</Link>
              </li>
              <li className="bg-blue-50 p-6 rounded-lg shadow-md hover:bg-blue-100 transition">
                <Link to="/institucional" className="text-xl text-blue-600">Información Institucional</Link>
              </li>
              <li className="bg-blue-50 p-6 rounded-lg shadow-md hover:bg-blue-100 transition">
                <Link to="/telegestion" className="text-xl text-blue-600">Telegestión</Link>
              </li>
              {/* Agrega más enlaces si es necesario */}
            </ul>
          </nav>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-4">
        <p>&copy; 2025 CENATE. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
