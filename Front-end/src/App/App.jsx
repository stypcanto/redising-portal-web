

import { Outlet } from "react-router-dom"
import Menu from "../components/Menu/Menu.jsx";



const App = () => {
  return (
      <>
      <Menu />
      <Outlet/>
      </>

      )
}

export default App;
