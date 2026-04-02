import Login from './usuario/logins.js'
import CrearUsuario from './usuario/crearUsuario.js'
import ModificarUsuario from './usuario/modificarUsuario.js'
import BarraNavegacion from './nbar/barra.js'

import './App.css';

function App() {


  return (
    <div className="App">
      {BarraNavegacion()}
     { Login()}
     {false && CrearUsuario()}
     {false && ModificarUsuario()}
    </div>
  );
}

export default App;
