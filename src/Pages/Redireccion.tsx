import { useState } from "react";
import { Link } from "react-router-dom";
import Footer_azul from "../components/Footer/Footer_azul";
import Header_template from "../components/Header/Header_template";
import Nav_intro from "../components/Nav/Nav_intro";
import NavTransversal from "../components/Nav/Nav_transversal"; // Ajusta la ruta según sea necesario

const Redireccion = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  function handleCardClick(cardName: string | null) {
    if (selectedCard !== cardName) {
      setSelectedCard(cardName); // Solo cambia el contenido mostrado
    } else {
      // No cambia el estado si ya está seleccionado
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Header_template>
        <div className="flex items-center justify-end p-4 space-x-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-400">
            <img
              src="/images/medico1.jpg"
              alt="Foto de usuario"
              className="w-full h-full object-cover"
            />
          </div>
          <Link
            to="/"
            className="bg-white text-[#2e63a6] px-6 py-3 rounded transition duration-300 ease-in-out transform hover:bg-blue-400 hover:text-white hover:scale-110 shadow-lg"
          >
            Cerrar Sesión
          </Link>
        </div>
      </Header_template>

      <div className="flex flex-grow">
        <Nav_intro />

        <div className="flex-grow bg-blue-100 py-16 sm:px-6 lg:px-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-[#2e63a6] mb-8 uppercase text-left">
              Bienvenido al Portal de Datos del CENATE
            </h1>

            <nav className="bg-white py-4 mb-10 border-1 border-[#2e63a6] rounded-xl">
              <div className="max-w-7xl mx-auto text-center">
                <ul className="flex justify-center space-x-6">
                  <li>
                    <button
                      className="text-xl font-semibold hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
                      onClick={() => handleCardClick("DireccionGeneral")}
                    >
                      Dirección General
                    </button>
                  </li>
                  <li>
                    <button
                      className="text-xl font-semibold hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
                      onClick={() => handleCardClick("SDGT")}
                    >
                      SDGT
                    </button>
                  </li>
                  <li>
                    <button
                      className="text-xl font-semibold hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
                      onClick={() => handleCardClick("SDRIST")}
                    >
                      SDRIST
                    </button>
                  </li>
                  <li>
                    <button
                      className="text-xl font-semibold hover:text-white hover:bg-[#2e63a6] py-2 px-4 rounded transition duration-300"
                      onClick={() => handleCardClick("DireccionDespacho")}
                    >
                      Dirección de Despacho
                    </button>
                  </li>
                </ul>
              </div>
            </nav>

            <div className="bg-white p-8 rounded-xl shadow-lg min-h-[300px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedCard === "DireccionGeneral" && (
                  <>
                    <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                      <h3 className="text-xl font-semibold text-[#2e63a6]">
                        Gestión de Procesos y Mejora Continua
                      </h3>
                      <p className="text-gray-700 mt-2">R. de Calidad</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                      <h3 className="text-xl font-semibold text-[#2e63a6]">
                        Gestión de la Reputación
                      </h3>
                      <p className="text-gray-700 mt-2">R. de Imágen y Comunicación</p>
                    </div>
                  </>
                )}

                {selectedCard === "SDGT" && (
                  <>
                    <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                      <h3 className="text-xl font-semibold text-[#2e63a6]">Telegestión</h3>
                      <p className="text-gray-700 mt-2">Gestores Territoriales</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                      <h3 className="text-xl font-semibold text-[#2e63a6]">Telemedicina</h3>
                      <p className="text-gray-700 mt-2">Coordinadores</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                      <h3 className="text-xl font-semibold text-[#2e63a6]">Telemedicina</h3>
                      <p className="text-gray-700 mt-2">G. de Citas de Pacientes</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                      <h3 className="text-xl font-semibold text-[#2e63a6]">Teleformación en Salud</h3>
                      <p className="text-gray-700 mt-2">Telecapacitación / TeleIEC</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                      <h3 className="text-xl font-semibold text-[#2e63a6]">Telemedicina</h3>
                      <p className="text-gray-700 mt-2">G. de Citas de Prof. de Salud</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                      <h3 className="text-xl font-semibold text-[#2e63a6]">Gestión TI</h3>
                      <p className="text-gray-700 mt-2">R. de TI</p>
                    </div>
                  </>
                )}

                {selectedCard === "SDRIST" && (
                  <>
                    <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                      <h3 className="text-xl font-semibold text-[#2e63a6]">Diseño Institucional</h3>
                      <p className="text-gray-700 mt-2">
                        R. de regulación, iniciativas y servicios en Telesalud
                      </p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                      <h3 className="text-xl font-semibold text-[#2e63a6]">Proyectos Disruptivos</h3>
                      <p className="text-gray-700 mt-2">R. Investigación y proyectos</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                      <h3 className="text-xl font-semibold text-[#2e63a6]">Gestión de Datos</h3>
                      <p className="text-gray-700 mt-2">R. de Datos</p>
                    </div>
                  </>
                )}

                {selectedCard === "DireccionDespacho" && (
                  <>
                    <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                      <h3 className="text-xl font-semibold text-[#2e63a6]">RRHH</h3>
                      <p className="text-gray-700 mt-2">R. de RRHH</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                      <h3 className="text-xl font-semibold text-[#2e63a6]">Abastecimiento</h3>
                      <p className="text-gray-700 mt-2">R. de Abastecimiento</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                      <h3 className="text-xl font-semibold text-[#2e63a6]">Planeamiento</h3>
                      <p className="text-gray-700 mt-2">R. de Planeamiento</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                      <h3 className="text-xl font-semibold text-[#2e63a6]">Presupuesto</h3>
                      <p className="text-gray-700 mt-2">R. de Presupuesto</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:bg-blue-100 transition">
                      <h3 className="text-xl font-semibold text-[#2e63a6]">Contable</h3>
                      <p className="text-gray-700 mt-2">R. de Contable</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Aquí está el NavTransversal debajo del banner */}
        <NavTransversal />
      </div>

      <Footer_azul />
    </div>
  );
};

export default Redireccion;
