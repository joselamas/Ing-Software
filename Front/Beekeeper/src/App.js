
import React, { useState, useEffect } from 'react';

import Login from './usuario/login.js'
import CrearUsuario from './usuario/crearUsuario.js'
import ModificarUsuario from './usuario/modificarUsuario.js'
import BarraNavegacion from './nbar/barra.js'
import DashboardColmenas from './colmenas/DashboardColmenas';
import FormularioColmena from './colmenas/FormularioColmena';
import CrearApiario from './apiarios/crearApiario.js';
import ListarApiarios from './apiarios/listarApiarios.js';

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
     {viewState === 'VerMisColmenas' && (
        <DashboardColmenas 
          setViewState={setViewState} 
          usr={usr} 
        />
      )}
      {viewState === 'CrearNuevaColmenas' && (
        <FormularioColmena 
          setViewState={setViewState} 
          usr={usr} 
        />
      )}
       {viewState === 'VerMisApiarios' && (
        <ListarApiarios 
          setViewState={setViewState}
          usr={usr}/>
          )}
      {viewState === 'CrearApiaro' && (
        <CrearApiario 
          setViewState={setViewState}
          usr={usr}/>
          )}
    </div>
  );
}

export default App;
