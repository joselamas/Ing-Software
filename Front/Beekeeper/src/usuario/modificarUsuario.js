import React, { useState, useEffect } from 'react';
import * as WSUsuario from '../webService/WSusuario.js';

import "./css/modificarUsuario.css"


export default function ModificarUsuario(props){
  const [error, setError] = useState();

  console.log(props.urs)
    useEffect(() => {
    }, []);

    const aceptarLog = async() =>{
      var usuario = document.getElementById("usr").value;
      var clave = document.getElementById('clave').value;

      var urs = {
        idAsociado:usuario,
        clave:btoa(clave)
      }
      var usuarioF = null//await WScolibri.Login(urs)
      if(usuarioF.status > 0 )
      {
        props.setUsr(usuarioF)
        setError("")
      }
      else
        setError("Usuario invalido")

      console.log(usuarioF)
    }

    const restarLog = () =>{
      document.getElementById("usr").value = '';
      document.getElementById('clave').value = '';
    }
    
    const createView = () => {
      return (
        <div className="main-container">
    <div className="left-panel">
        </div>

    <div className="right-panel">
        <div className="form-container edit-profile">
            <div className="header-inline">
                <h1>Editar <span>Perfil</span></h1>
            </div>

            <form id="edit-form">
               <div className="input-group">
                        <label>Acronimo</label>
                        <input type="text" value={props.usr.acronimo} required disabled/>
                    </div>
                  <div className="input-group">
                        <label>Nombres</label>
                        <input type="text" value={props.usr.nombre} required disabled/>
                    </div>
                    <div className="input-group">
                        <label>Apellidos </label>
                        <input type="text" value={props.usr.apellido} required disabled/>
                    </div>

                    <div className="input-group">
                        <label>Teléfono</label>
                        <input type="tel" defaultValue={props.usr.telefono} required/>
                    </div>

                    <div className="input-group">
                        <label>Correo Electrónico</label>
                        <input type="email" defaultValue={props.usr.correo} required disabled/>
                    </div>

                      <div className="input-group">
                        <label>Localidad</label>
                        <input type="password" defaultValue={props.usr.localidad_asociada} required/>
                    </div>

                    <div className="input-group">
                        <label>Contraseña</label>
                        <input type="password" placeholder="Mínimo 8 caracteres" required minLength="8" maxLength="20"/>
                    </div>

                      <div className="input-group">
                        <label>Repetir Contraseña</label>
                        <input type="password" placeholder="Mínimo 8 caracteres" required minLength="8" maxLength="20"/>
                    </div>

                <div className="button-group">
                    {false&& <button type="button" className="secondary-btn">Cancelar</button>}
                    <button type="submit" className="primary-btn">Guardar Cambios</button>
                </div>
            </form>
        </div>
    </div>
</div>
      )
    }
return(
  <section>
    {createView()}
  </section>
    
 
  )
}



