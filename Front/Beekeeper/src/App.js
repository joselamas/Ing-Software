
import React, { useState, useEffect } from 'react';

import Login from './usuario/login.js'
import CrearUsuario from './usuario/crearUsuario.js'
import ModificarUsuario from './usuario/modificarUsuario.js'
import BarraNavegacion from './nbar/barra.js'

import './App.css';

function App() {

    const [viewState, setViewState] = useState("Login");
    const [usr, setUsr] = useState(null);

  
  return (
    <div className="App">
      {viewState !== 'Login' && viewState !== 'CrearUsuario' && <BarraNavegacion
        setViewState = {setViewState}
        setUsr={setUsr}
      />}
      { viewState === 'Login' &&
        <Login
          setUsr={setUsr}
          setViewState = {setViewState}
         />}
     {viewState  === 'CrearUsuario' &&  
        <CrearUsuario
          setViewState = {setViewState}
        />}
     {viewState  === 'ActualizarDatos' && <ModificarUsuario
        setViewState = {setViewState}
        usr={usr}
     />}
    </div>
  );
}

export default App;
