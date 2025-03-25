import React from 'react';

interface ViewUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    id: number;
    nombres: string;
    apellido_paterno?: string;
    apellido_materno?: string;
    dni: string;
    rol: string;
    email?: string;
    telefono?: string;
  };
}

const ViewUsuarioModal: React.FC<ViewUsuarioModalProps> = ({ 
  isOpen, 
  onClose, 
  userData 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <h3 className="mb-4 text-xl font-bold text-gray-800">Detalles del Usuario</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombres</label>
              <p className="mt-1 text-gray-900">{userData.nombres}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">DNI</label>
              <p className="mt-1 text-gray-900">{userData.dni}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Apellido Paterno</label>
              <p className="mt-1 text-gray-900">{userData.apellido_paterno || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Apellido Materno</label>
              <p className="mt-1 text-gray-900">{userData.apellido_materno || 'N/A'}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              userData.rol === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {userData.rol}
            </span>
          </div>

          {(userData.email || userData.telefono) && (
            <div className="pt-4 mt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700">Contacto</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {userData.email && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{userData.email}</p>
                  </div>
                )}
                {userData.telefono && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Teléfono</label>
                    <p className="mt-1 text-sm text-gray-900">{userData.telefono}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUsuarioModal;