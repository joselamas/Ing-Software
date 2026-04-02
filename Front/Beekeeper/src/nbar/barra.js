import React, { useState, useEffect } from 'react';

import "./barra.css"


export default function BarraNavegacion(props){
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
      return (<nav class="navbar-horizontal">
    <div class="nav-container">
        <div class="nav-logo">
            <div class="logo-icon">⬢</div>
            <span>BEEKEEPER</span>
        </div>
        
        <ul class="nav-links">
            <li><a href="#" class="active">Mis Colmenas</a></li>
            <li><a href="#">Mis Apiarios</a></li>
            <li><a href="#">Perfil</a></li>
        </ul>

        <div class="nav-user">
            <div class="user-avatar">CM</div>
            <div class="user-info">
                <p class="user-name">Carlos M.</p>
                <a href="#" class="logout-link">Cerrar Sesión</a>
            </div>
        </div>
    </div>
</nav>)
    }
return(
  <section>
    {createView()}
  </section>
    
 
  )
}



