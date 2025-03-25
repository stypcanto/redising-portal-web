import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


interface Usuario {
  id: number;
  dni: string;
  nombres: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  fecha_nacimiento?: string | null;
  sexo?: string | null;
  correo?: string;
  telefono?: string | null;
  domicilio?: string | null;
  profesion?: string | null;
  especialidad?: string | null;
  colegiatura?: string | null;
  tipo_contrato?: string | null;
  rol: string;
  fecha_registro?: string;
}

interface ViewUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: Usuario;
}

const ViewUsuarioModal: React.FC<ViewUsuarioModalProps> = ({
  isOpen,
  onClose,
  userData
}) => {
  // Campos excluidos
  const excludedFields = ['id', 'password', 'estado'];

  // Formatear nombres de campos
  const formatFieldName = (field: string): string => {
    const fieldNames: Record<string, string> = {
      dni: 'DNI',
      nombres: 'Nombres Completos',
      apellido_paterno: 'Apellido Paterno',
      apellido_materno: 'Apellido Materno',
      fecha_nacimiento: 'Fecha de Nacimiento',
      sexo: 'Género',
      correo: 'Correo Electrónico',
      telefono: 'Teléfono',
      domicilio: 'Dirección',
      profesion: 'Profesión',
      especialidad: 'Especialidad',
      colegiatura: 'N° Colegiatura',
      tipo_contrato: 'Tipo de Contrato',
      rol: 'Rol en el Sistema',
      fecha_registro: 'Fecha de Registro'
    };

    return fieldNames[field] || field.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
  };

  // Formatear valores
  const formatValue = (key: string, value: any): React.ReactNode => {
    if (value === null || value === undefined || value === '') {
      return <span className="italic text-gray-400">No especificado</span>;
    }

    // Formato para fechas
    if (key.includes('fecha')) {
      try {
        return new Date(value).toLocaleDateString('es-PE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return value;
      }
    }

    // Formato especial para rol
    if (key === 'rol') {
      const roleColors = {
        'Superadmin': 'bg-purple-100 text-purple-800',
        'Admin': 'bg-green-100 text-green-800',
        'Administrador': 'bg-green-100 text-green-800',
        'Usuario': 'bg-blue-100 text-blue-800',
        'default': 'bg-gray-100 text-gray-800'
      };

      const colorClass = roleColors[value as keyof typeof roleColors] || roleColors.default;

      return (
        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${colorClass}`}>
          {value}
        </span>
      );
    }

    return <span className="font-medium">{String(value)}</span>;
  };

  // Agrupación de campos
  const fieldGroups = [
    {
      title: 'Información Personal',
      icon: '👤',
      fields: ['nombres', 'apellido_paterno', 'apellido_materno', 'dni', 'sexo', 'fecha_nacimiento']
    },
    {
      title: 'Datos de Contacto',
      icon: '📱',
      fields: ['correo', 'telefono', 'domicilio']
    },
    {
      title: 'Información Profesional',
      icon: '💼',
      fields: ['profesion', 'especialidad', 'colegiatura', 'tipo_contrato']
    },
    {
      title: 'Datos del Sistema',
      icon: '🔐',
      fields: ['rol', 'fecha_registro']
    }
  ];


  //Generacion de PDF
  const exportToPDF = async () => {
    const input = document.getElementById('user-details-container');
    if (!input) return;
  
    // 1. Mostrar loader mejorado
    const loader = document.createElement('div');
    loader.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      ">
        <div style="
          background: white;
          padding: 2rem;
          border-radius: 8px;
          text-align: center;
        ">
          <div style="
            border: 4px solid #f3f3f3;
            border-top: 4px solid #2e63a6;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          "></div>
          <p>Generando PDF...</p>
        </div>
      </div>
    `;
    document.body.appendChild(loader);
  
    try {
      // 2. Crear clon con estilos simplificados
      const clone = input.cloneNode(true) as HTMLElement;
      clone.id = 'pdf-clone';
      clone.style.cssText = `
        position: absolute;
        left: -9999px;
        width: 210mm;
        background: white;
        padding: 20px;
      `;
  
      // 3. Reemplazar todos los estilos problemáticos
      const elements = clone.querySelectorAll('*');
      elements.forEach(el => {
        if (el instanceof HTMLElement) {
          // Eliminar gradientes y funciones de color modernas
          if (el.style.background.includes('gradient') || 
              el.style.background.includes('oklch')) {
            el.style.background = '#2e63a6';
            el.style.backgroundImage = 'none';
          }
          
          // Forzar colores sólidos
          if (el.style.color) {
            el.style.color = '#000000';
          }
        }
      });
  
      // 4. Eliminar elementos interactivos
      const interactiveElements = clone.querySelectorAll('button, a, [onclick]');
      interactiveElements.forEach(el => el.remove());
  
      document.body.appendChild(clone);
  
      // 5. Configuración ultra-compatible para html2canvas
      const canvas = await html2canvas(clone, {
        scale: 1,
        logging: true,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        onclone: (clonedDoc) => {
          // Limpieza adicional en el clon
          const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          styles.forEach(style => style.remove());
        }
      });
  
      // 6. Generar PDF con márgenes
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 180; // Margen de 15mm cada lado
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(canvas, 'PNG', 15, 15, imgWidth, imgHeight);
      pdf.save(`Usuario_${userData.dni}.pdf`);
  
    } catch (error) {
      console.error('Error detallado:', error);
      
      // Mensaje específico para el usuario
      alert(`Para exportar correctamente:
  1. Use Google Chrome
  2. Asegúrese de tener la versión más reciente
  3. Desactive bloqueadores de pop-ups
  4. Intente nuevamente`);
      
    } finally {
      // Limpieza garantizada
      const loader = document.querySelector('div[style*="position: fixed; top: 0"]');
      if (loader) loader.remove();
      
      const clone = document.getElementById('pdf-clone');
      if (clone) clone.remove();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div id="user-details-container" className="relative w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-xl">
        {/* Encabezado */}
        <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">Detalles del Usuario</h2>
              <p className="text-blue-100">Información completa del registro</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={exportToPDF}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-white rounded-md hover:bg-blue-50"
                title="Exportar a PDF"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                PDF
              </button>
              <button
                onClick={onClose}
                className="p-2 text-white rounded-full hover:bg-blue-700"
                aria-label="Cerrar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {fieldGroups.map((group) => {
            const fieldsToShow = group.fields.filter(
              field => userData[field as keyof Usuario] !== undefined &&
                !excludedFields.includes(field)
            );

            if (fieldsToShow.length === 0) return null;

            return (
              <div key={group.title} className="mb-8 last:mb-0">
                <div className="flex items-center mb-4">
                  <span className="mr-3 text-2xl">{group.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-800">{group.title}</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {fieldsToShow.map((field) => (
                    <div key={field} className="p-4 rounded-lg bg-gray-50">
                      <div className="mb-1 text-sm font-medium text-gray-500">
                        {formatFieldName(field)}
                      </div>
                      <div className="text-gray-800">
                        {formatValue(field, userData[field as keyof Usuario])}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pie de página */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUsuarioModal;