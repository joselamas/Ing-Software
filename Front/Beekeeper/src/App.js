
import React, { useState } from 'react';
import BarraNavegacion from './nbar/barra.js'

import Login from './usuario/login.js'
import CrearUsuario from './usuario/crearUsuario.js'
import ModificarUsuario from './usuario/modificarUsuario.js'
import MiPerfil from './usuario/miPerfil.js';

import VerColmenas from './colmenas/VerColmenas.js';
import RegistrarColmena from './colmenas/RegistrarColmena.js';

import CrearApiario from './apiarios/crearApiario.js';
import ListarApiarios from './apiarios/listarApiarios.js';
import DetalleApiario from './apiarios/detalleApiario.js';
import ModificarApiario from './apiarios/ModificarApiario.js';

import './App.css';

function App() {

    const [viewState, setViewState] = useState("Login");
    const [usr, setUsr] = useState(null);
    const [selectedApiario, setSelectedApiario] = useState(null);

  return (
    <div className="App">
      {viewState !== 'Login' && viewState !== 'CrearUsuario' && <BarraNavegacion
        setViewState = {setViewState}
        setUsr={setUsr}
        usr = {usr}
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
        setUsr={setUsr}
     />}
     {viewState === 'VerMisColmenas' && (
        <VerColmenas 
          setViewState={setViewState} 
          usr={usr} 
        />
      )}
      {viewState === 'CrearNuevaColmenas' && (
        <RegistrarColmena 
          setViewState={setViewState} 
          usr={usr} 
        />
      )}
       {viewState === 'VerMisApiarios' && (
        <ListarApiarios 
          setViewState={setViewState}
          setSelectedApiario={setSelectedApiario}
          usr={usr}/>
          )}
      {viewState === 'DetalleApiario' && (
        <DetalleApiario
          apiario={selectedApiario}
          setViewState={setViewState}
          usr={usr}
        />
      )}
      {viewState === 'ModificarApiario' && usr && selectedApiario && (
        <ModificarApiario
          apiario={selectedApiario}
          setViewState={setViewState}
        />
      )}
      {viewState === 'CrearApiaro' && (
        <CrearApiario 
          setViewState={setViewState}
          usr={usr}/>
          )}
      {viewState === 'MiPerfil' && (
        <MiPerfil 
          setViewState={setViewState}
          usr={usr}
        />
      )}
    </div>
  );
}

export default App;
