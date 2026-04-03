import React, { useState, useEffect } from 'react';
import * as WSUsuario from '../webService/WSusuario.js';

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
      return (<div className="login-container">
        <div className="left-panel">
            <div className="pattern-overlay"></div>
        </div>

        <div className="right-panel">
            <div className="form-wrapper">
                <h1 className="main-title">Iniciar Sesión</h1>
                <p className="sub-title">Accede a tu cuenta de apicultor</p>

                <form className="login-form">
                    <div className="input-group">
                        <label for="email">Correo Electrónico</label>
                        <div className="input-wrapper">
                            <i className="fas fa-envelope input-icon"></i>
                            <input type="email" id="email" placeholder="ejemplo@correo.com" required/>
                        </div>
                    </div>

                    <div className="input-group">
                        <label for="password">Contraseña</label>
                        <div className="input-wrapper">
                            <i className="fas fa-lock input-icon"></i>
                            <input type="password" id="password" placeholder="********" required/>
                        </div>
                    </div>

                    <button type="submit" className="primary-btn" onClick={ () => props.setViewState('ModificarUsuario') }>
                        Entrar <i className="fas fa-arrow-right arrow-icon"></i>
                    </button>
                </form>

                <div className="footer-links">
                    <p>¿No tienes cuenta? <a href="#" onClick = {() => props.setViewState("CrearUsuario")}className="link-bold">Crear Cuenta</a></p>
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



