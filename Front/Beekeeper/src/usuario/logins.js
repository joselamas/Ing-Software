import React, { useState, useEffect } from 'react';
import * as WSUsuario from '../webService/usuario.js';

import "./css/login.css"


export default function Login(props){
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
      return (<div class="login-container">
        <div className="left-panel">
            <div class="pattern-overlay"></div>
        </div>

        <div className="right-panel">
            <div class="form-wrapper">
                <h1 class="main-title">Iniciar Sesión</h1>
                <p class="sub-title">Accede a tu cuenta de apicultor</p>

                <form class="login-form">
                    <div class="input-group">
                        <label for="email">Correo Electrónico</label>
                        <div class="input-wrapper">
                            <i class="fas fa-envelope input-icon"></i>
                            <input type="email" id="email" placeholder="ejemplo@correo.com" required/>
                        </div>
                    </div>

                    <div class="input-group">
                        <label for="password">Contraseña</label>
                        <div class="input-wrapper">
                            <i class="fas fa-lock input-icon"></i>
                            <input type="password" id="password" placeholder="********" required/>
                        </div>
                    </div>

                    <button type="submit" class="submit-btn">
                        Entrar <i class="fas fa-arrow-right arrow-icon"></i>
                    </button>
                </form>

                <div class="footer-links">
                    <p>¿No tienes cuenta? <a href="#" class="link-bold">Crear Cuenta</a></p>
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



