import React, { useState, useEffect } from 'react';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado correctamente

    // Verificar si el token está presente
    if (!token) {
      setError('No estás autenticado');
      setLoading(false);
      return;
    }

    // Hacer la solicitud GET para obtener los usuarios
    fetch('http://localhost:5001/admin/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setUsuarios(data.data); // Asignar los usuarios obtenidos
        } else {
          setError(data.message); // Mostrar mensaje de error si no es exitoso
        }
      })
      .catch(err => {
        console.error('Error al obtener usuarios:', err);
        setError('Error al obtener los usuarios');
      })
      .finally(() => setLoading(false)); // Cambiar estado de carga a falso
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.dni}</td>
              <td>{usuario.nombres} {usuario.apellido_paterno} {usuario.apellido_materno}</td>
              <td>{usuario.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;
