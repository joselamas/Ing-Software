import React, { useState, useEffect } from 'react';
import * as WSUsuario from '../webService/usuario.js';

import "./css/crearUsuario.css"


export default function CrearUsuario(props){
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
      return (<div class="main-container">
        <div class="left-panel">
            <div class="overlay-content">
                <div class="bee-icon">
                    <img src="https://cdn-icons-png.flaticon.com/512/517/517563.png" alt="Logo"/>
                </div>
                <h2>Gestiona tu colmena</h2>
                <p>La herramienta definitiva para el apicultor moderno, diseñada para el cuidado de tus abejas.</p>
            </div>
        </div>

        <div class="right-panel">
            <div class="form-container">
                <h1>Crear Cuenta</h1>
                <p class="form-desc">Únete para gestionar tus apiarios fácilmente.</p>

                <form id="auth-form">
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


                    <button type="submit" class="primary-btn">Registrarse</button>
                </form>

                <div class="form-footer">
                    <p>¿Ya tienes cuenta? <a href="#">Iniciar Sesión</a></p>
                </div>
            </div>
        </div>
    </div>)
    }
return(
  <section>
    {createView()}
  </section>
    
 
  )
}



