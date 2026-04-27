
import React, { useState } from 'react';
import BarraNavegacion from './nbar/barra.js'

import Login from './usuario/login.js'
import Home from './componentes/Home.js';
import CrearUsuario from './usuario/crearUsuario.js'
import ModificarUsuario from './usuario/modificarUsuario.js'
import MiPerfil from './usuario/miPerfil.js';

import VerColmenas from './colmenas/VerColmenas.js';
import DetalleColmena from './colmenas/DetalleColmena.js';
import RegistrarColmena from './colmenas/RegistrarColmena.js';
import ModificarColmena from './colmenas/ModificarColmena.js';

import AlimentarColmena from './produccion_mantenimiento/AlimentarColmena.js';
import RegistrarProduccion from './produccion_mantenimiento/RegistrarProduccion.js';
import VerCosechas from './produccion_mantenimiento/VerCosechas.js';
import VerAlimentacion from './produccion_mantenimiento/VerAlimentacion.js';
import Estadisticas from './estadisticas/Estadisticas.js';
import AnalisisApiarios from './estadisticas/AnalisisApiarios.js';
import EficienciaApiarios from './estadisticas/EficienciaApiarios.js';
import RendimientoAltura from './estadisticas/RendimientoAltura.js';

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

    console.log("Estado actual:", { viewState, usr, selectedApiario, selectedColmena });

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
     {viewState   === 'CrearUsuario' &&  
        <CrearUsuario
          setViewState = {setViewState}
        />}

      {viewState === 'Home' && usr && (
        <Home />
      )}

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

      {viewState === 'DetalleColmena' && selectedColmena && (
        <DetalleColmena 
          colmena={selectedColmena} 
          setViewState={setViewState} 
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

      {viewState === 'VerCosechas' && (
        <VerCosechas 
          usr={usr}
          setViewState={setViewState}
        />
      )}

      {viewState === 'VerAlimentacion' && (
        <VerAlimentacion 
          usr={usr}
          setViewState={setViewState}
        />
      )}

      {viewState === 'Estadisticas' && (
        <Estadisticas 
          usr={usr}
          setViewState={setViewState}
        />
      )}

      {viewState === 'AnalisisApiarios' && (
        <AnalisisApiarios 
          usr={usr}
        />
      )}

      {viewState === 'EficienciaApiarios' && (
        <EficienciaApiarios 
          usr={usr}
        />
      )}

      {viewState === 'RendimientoAltura' && (
        <RendimientoAltura 
          usr={usr}
        />
      )}
    </div>
  );
}

export default App;