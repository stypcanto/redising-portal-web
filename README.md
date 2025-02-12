# Proyecto Final - Portal de Gestión de Administración para profesionales de CENATE ESSALUD

Este proyecto es de propiedad de Ing. Styp Canto, CIP. 131278.

Contacto: styp611@outlook.com

---
Sistema creado con login de autenticación con React, Node.js y PostgreSQL

Este proyecto es un sistema de autenticación completo con **React** en el frontend y **Node.js** con **Express** en el backend. Proporciona las funcionalidades esenciales para la gestión de usuarios y autenticación segura, usando las mejores prácticas de seguridad.

Comparto este proyecto ya que es una muy buena herramienta para entrenar como funciona el front-end y el back-end combinando multiples tecnologías:

- Frontend: React, Axios
- Backend: Node.js, Express
- Base de datos: PostgreSQL
- Autenticación: JWT, bcrypt

---

## 🚀 Funcionalidades

- **Registro de usuarios**: Los usuarios pueden registrarse proporcionando un nombre de usuario y contraseña.
- **Inicio de sesión**: Autenticación mediante nombre de usuario y contraseña.
- **Encriptación de contraseñas**: Las contraseñas se encriptan de manera segura usando **bcrypt**.
- **JSON Web Tokens (JWT)**: Implementación de JWT para una autenticación segura.
- **Protección de rutas privadas**: Solo los usuarios autenticados pueden acceder a rutas privadas del sistema.

---
📥 Instalación

- Clona este repositorio:

```bash
git clone <https://github.com/stypcanto/sistema-autentificacion-v1>

```
- Navega a la carpeta del proyecto y instala las dependencias:
    - En el backend:
    ```bash
        cd backend
        npm init -y
        npm install express pg bcryptjs jsonwebtoken cors dotenv
        npm install nodemon --save-dev

```
Paso 1: En la raíz de tu proyecto de backend, crea un archivo .env con el siguiente contenido:

 ```bash
JWT_SECRET=mi_clave_secreta
```
Paso 2: Cargar la variable de entorno

Asegúrate de que en tu archivo server.js (o el archivo donde gestionas el JWT), estés cargando correctamente las variables de entorno. Instala la librería dotenv si no la tienes:

 ```bash
npm install dotenv

```
Y en la parte superior de tu archivo server.js, agrega:
 ```bash
require('dotenv').config();

```
      
         En el frontend:
        ```bash
        cd frontend
        npm install
        npm install axios
 
    ```
    - Ejecuta el servidor del backend:

     ```bash
        npm init -y
        npm install express pg bcryptjs jsonwebtoken cors dotenv
        npm install nodemon --save-dev

        npm install --save crypto
        npm install --save pg-native

        npm install pg@latest
        npm install dotenv



  ```

 4. Ejecuta el frontend con:
  
   ```bash
        
     npm start

 ```
