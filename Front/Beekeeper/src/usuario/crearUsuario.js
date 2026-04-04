import React, { useState } from 'react';
import Modal from '../componentes/modalMSN.js';
import * as WSUsuario from '../webService/WSusuario.js';
import "./css/crearUsuario.css"

export default function CrearUsuario(props) {
    const [formData, setFormData] = useState({
        acronimo: '',
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        localidad_asociada: '',
        clave: '',
        repetirClave: '',
        permiso: 2,
        activo:true
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState("");
    const [modalInfo, setModalInfo] = useState({
        titulo: '',
        mensaje: ''});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value 
        });
    };

    const manejarRegistro = async (e) => {
      e.preventDefault();

      if (formData.clave !== formData.repetirClave) {
          setError("Las contraseñas no coinciden");
          return;
      }

      const { repetirClave, ...datosAEnviar } = formData;

      const payload = {
          ...datosAEnviar,
          clave: btoa(datosAEnviar.clave) 
      };

    try {
      const respuesta =  await WSUsuario.CrearUsuario(payload); 
      console.log(respuesta)
      if (respuesta && respuesta.status > 0) {
        setModalInfo({
          titulo: "Registro Exitoso",
          mensaje: "El usuario se ha creado correctamente en Beekeeper"
        });
      } else {
          if(respuesta.status === 0)
          setModalInfo({
              titulo: "Error al Crear Usuario",
              mensaje: respuesta.mensaje || "Ocurrió un error al crear el usuario"
          });
          else
             setModalInfo({
              titulo: "Error al conectar con el servidor",
                mensaje: "No se pudo conectar con el servidor. Por favor, intenta nuevamente más tarde."
          });
      }
      } catch (err) {
              setModalInfo({
                titulo: "Error de Conexión",
                mensaje: "No se pudo conectar con el servidor. Por favor, intenta nuevamente más tarde."
              });
      }
      setIsModalOpen(true);
  };

    const createView = () => {
        return (
            <div className="crearUsuario-container">
                <div className="left-panel">
                    <div className="overlay-content">
                        <div className="bee-icon">
                            <img src="https://cdn-icons-png.flaticon.com/512/517/517563.png" alt="Logo"/>
                        </div>
                        <h2>Gestiona tu colmena</h2>
                        <p>La herramienta definitiva para el apicultor moderno.</p>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="form-container">
                        <h1>Crear Cuenta</h1>
                        <p className="form-desc">Únete para gestionar tus apiarios fácilmente.</p>

                        {error && <p style={{color: 'red', fontWeight: 'bold'}}>{error}</p>}

                        <form id="auth-form" onSubmit={manejarRegistro} noValidate>
                            <div className="input-group">
                                <label>Acronimo</label>
                                <input type="text" name="acronimo" value={formData.acronimo} onChange={handleChange} placeholder="JMLT" required minLength="4" maxLength="10" />
                            </div>
                            <div style={{display: "flex", gap: "10px"}}>
                                <div className="input-group">
                                    <label>Nombres</label>
                                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                                </div>
                                <div className="input-group">
                                    <label>Apellidos</label>
                                    <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Teléfono</label>
                                <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Correo Electrónico</label>
                                <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Localidad</label>
                                <input type="text" name="localidad_asociada" value={formData.localidad_asociada} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Contraseña</label>
                                <input type="password" name="clave" value={formData.clave} onChange={handleChange} required minLength="8" maxLength="20" />
                            </div>
                            <div className="input-group">
                                <label>Repetir Contraseña</label>
                                <input type="password" name="repetirClave" value={formData.repetirClave} onChange={handleChange} required minLength="8" maxLength="20" />
                            </div>
                            <button type="submit" className="primary-btn">Registrarse</button>
                        </form>
                         <div className="form-footer">
                            <p>¿Ya tienes cuenta? <a href="#" onClick={() => props.setViewState("Login")}>Iniciar Sesión</a></p>
                        </div>
                    </div>
                </div>
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={setIsModalOpen} 
                    goView={props.setViewState} 
                    view = {modalInfo.titulo === 'Registro Exitoso' ? "Login" :""}
                    title={modalInfo.titulo}
                    message={modalInfo.mensaje}
                    type = {modalInfo.titulo === 'Registro Exitoso' ? "success" :"error"}
                />
            </div>
        );
    }
    return <section>{createView()}</section>;
}