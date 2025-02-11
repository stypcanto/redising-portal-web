import { StrictMode } from "react";
import { createRoot } from "react-dom/client"; // Para React 18 y versiones posteriores
import App from "./App/App"; // Asegúrate de que la ruta sea correcta
import "./Styles/styles.css"; // Asegúrate de que esta ruta sea correcta, o elimina la línea si no la necesitas

const root = document.getElementById("root")!;
const rootElement = createRoot(root);

rootElement.render(
  <StrictMode>
    <App />
  </StrictMode>
);
