
import ReactDOM from "react-dom/client";
import App from "./App/App";  // Asegúrate de que la ruta sea correcta
import "./index.css";  // O tu archivo de estilos
import { BrowserRouter } from "react-router-dom";  // Asegúrate de que esté envuelto en BrowserRouter
const root = document.getElementById("root") as HTMLElement;
const rootElement = ReactDOM.createRoot(root);

rootElement.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);