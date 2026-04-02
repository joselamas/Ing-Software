import React, { useState, useEffect } from 'react';
import * as WSUsuario from '../webService/usuario.js';

import "./css/modificarUsuario.css"


export default function ModificarUsuario(props){
  const [error, setError] = useState();

  
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
        <div class="main-container">
    <div class="left-panel">
        </div>

    <div class="right-panel">
        <div class="form-container edit-profile">
            <div class="header-inline">
                <button class="back-arrow"><i class="fa-solid fa-arrow-left"></i></button>
                <h1>Editar <span>Perfil</span></h1>
            </div>

            <form id="edit-form">
               <div class="input-group">
                        <label>Acronimo</label>
                        <input type="text" placeholder="dkxeh5" required/>
                    </div>
                  <div class="input-group">
                        <label>Nombres</label>
                        <input type="text" placeholder="Ej. Juan Jose" required/>
                    </div>
                    <div class="input-group">
                        <label>Apellidos </label>
                        <input type="text" placeholder="Ej. Rojas Uzcategui" required/>
                    </div>

                    <div class="input-group">
                        <label>Teléfono</label>
                        <input type="tel" placeholder="Ej. +34 600 000 000" required/>
                    </div>

                    <div class="input-group">
                        <label>Correo Electrónico</label>
                        <input type="email" placeholder="juan@apiario.com" required/>
                    </div>

                      <div class="input-group">
                        <label>Localidad</label>
                        <input type="password" placeholder="Merida-Vnzl" required/>
                    </div>

                    <div class="input-group">
                        <label>Contraseña</label>
                        <input type="password" placeholder="Mínimo 8 caracteres" required/>
                    </div>

                      <div class="input-group">
                        <label>Repetir Contraseña</label>
                        <input type="password" placeholder="Mínimo 8 caracteres" required/>
                    </div>

                <div class="button-group">
                    <button type="button" class="secondary-btn">Cancelar</button>
                    <button type="submit" class="primary-btn">Guardar Cambios</button>
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



