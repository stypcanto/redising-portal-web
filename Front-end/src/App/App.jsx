import { Outlet } from "react-router-dom";
import Menu from "../components/Menu/Menu.jsx";

const App = () => {
  console.log("✅ API_URL:", import.meta.env.VITE_API_URL);

  return (
    <>
      <Menu />
      <Outlet />
    </>
  );
};

export default App;
