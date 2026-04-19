
import React, { useState } from 'react';
import BarraNavegacion from './nbar/barra.js'

import Login from './usuario/login.js'
import CrearUsuario from './usuario/crearUsuario.js'
import ModificarUsuario from './usuario/modificarUsuario.js'
import MiPerfil from './usuario/miPerfil.js';

import VerColmenas from './colmenas/VerColmenas.js';
import RegistrarColmena from './colmenas/RegistrarColmena.js';
import ModificarColmena from './colmenas/ModificarColmena.js';

import AlimentarColmena from './produccion_mantenimiento/AlimentarColmena.js';
import RegistrarProduccion from './produccion_mantenimiento/RegistrarProduccion.js';

import CrearApiario from './apiarios/crearApiario.js';
import ListarApiarios from './apiarios/listarApiarios.js';
import DetalleApiario from './apiarios/detalleApiario.js';
import ModificarApiario from './apiarios/ModificarApiario.js';

import './App.css';

function App() {

    const [viewState, setViewState] = useState("Login");
    const [usr, setUsr] = useState(null);
    const [selectedApiario, setSelectedApiario] = useState(null);
    const [selectedApiarioID, setSelectedApiarioID] = useState(null);

    const [selectedColmena, setSelectedColmena] = useState(null);


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

      {viewState === 'MiPerfil' && (
        <MiPerfil 
          setViewState={setViewState}
          usr={usr}
        />
      )}


     {viewState === 'VerMisColmenas' && (
        <VerColmenas 
          setViewState={setViewState} 
          setSelectedColmena={setSelectedColmena}
          usr={usr} 
          setSelectedApiarioID= {setSelectedApiarioID}
        />
      )}

      {viewState === 'CrearNuevaColmenas' && (
        <RegistrarColmena 
          setViewState={setViewState} 
          usr={usr} 
        />
      )}
      {viewState === 'ModificarColmena' && usr && selectedColmena && (
        <ModificarColmena 
          colmena={selectedColmena} 
          usr={usr}
          setViewState={setViewState} 
          selectedColmena={selectedColmena}
          setSelectedApiarioID={setSelectedApiarioID}
          selectedApiarioID={selectedApiarioID} 
        />
      )}
      {viewState === 'AlimentarColmena' &&  (
        <AlimentarColmena 
          colmena={selectedColmena} 
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
          usr ={usr}
        />
      )}
     
      {viewState === 'CrearApiaro' && (
        <CrearApiario 
          setViewState={setViewState}
          usr={usr}/>
          )}

           {viewState === 'RegistrarProduccion' && (
        <RegistrarProduccion 
          setViewState={setViewState} 
          usr={usr}
        />
      )}
    </div>
  );
}

export default App;
