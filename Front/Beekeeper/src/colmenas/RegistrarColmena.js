import React, { useState, useEffect } from 'react';
import * as WSColmena from '../webService/WS_colmena';
import * as WSApiario from '../webService/WS_apiario.js';
import './css/registrarColmena.css';
import apitherapy from '../imagenes/apitherapy.png';
import ModalMSN from '../componentes/modalMSN';

// URL de imagen externa para evitar errores de carga local
const imagenColmena = apitherapy;

const RegistrarColmena = (props) => {
    const [colmena, setColmena] = useState({
        usuario_acronimo: props.usr?.acronimo || '',
        id_colmena_usuario: '',
        tipo_colmena: '',
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_inicio_reina: new Date().toISOString().split('T')[0],
        es_enjambre: true,
        id_colmena_madre: '',
        apiario_id: '',
        estado: ''
    });

    const [apiarios, setApiarios] = useState([]);
    const [colmenasMadreDisponibles, setColmenasMadreDisponibles] = useState([]);
    const [searchTermMadre, setSearchTermMadre] = useState('');
    const [cargando, setCargando] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({ titulo: '', mensaje: '', tipo: '' });

    // Carga de datos iniciales al abrir el componente
    useEffect(() => {
        const cargarDatos = async () => {
            if (!props.usr) return;
            try {
                // Obtenemos apiarios para el combo
                const resApi = await WSApiario.ListarApiarios(props.usr.acronimo);
                if (resApi && resApi.status === 1) {
                    setApiarios(resApi.apiarios || []);
                }

                // Obtenemos colmenas para la lista de sugerencias de "Colmena Madre"
                const resCol = await WSColmena.getColmena_Id_IdAsig(props.usr.acronimo);
                if (Array.isArray(resCol)) {
                    // Corregido: Actualizamos el estado de la lista, no el objeto colmena del formulario
                    setColmenasMadreDisponibles(resCol);
                }
            } catch (err) {
                console.error("Error al cargar catálogos iniciales:", err);
                // Manejo silencioso para evitar el error de conexión apenas se abre la vista
            }
        };
        cargarDatos();
    }, [props.usr]);

    const manejarCambio = (e) => {
        const { name, value, type, checked } = e.target;
        setColmena((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const manejarCambioMadre = (e) => {
        const val = e.target.value;
        setSearchTermMadre(val);
        const match = colmenasMadreDisponibles.find(c => c.id_colmena_usuario === val);
        if (match) {
            setColmena(prev => ({ ...prev, id_colmena_madre: match.id }));
        } else {
            setColmena(prev => ({ ...prev, id_colmena_madre: '' }));
        }
    };

    const registrar = async (e) => {
        e.preventDefault();

        if (!colmena.apiario_id) {
            setModalInfo({ titulo: 'Validación', mensaje: 'Debes asignar la colmena a un apiario.', tipo: 'error' });
            setIsModalOpen(true);
            return;
        }

        setCargando(true);
        try {
            const apiarioId = parseInt(colmena.apiario_id);
            const payload = {
                ...colmena,
                id_colmena_madre: colmena.es_enjambre ? null : (parseInt(colmena.id_colmena_madre) || null),
                fecha_inicio_reina: colmena.es_enjambre ? null : colmena.fecha_inicio_reina,
                activo: true
            };
            
            delete payload.apiario_id;

            const res = await WSColmena.insertarColmena(payload, apiarioId);
            if (res) {
                setModalInfo({ titulo: 'Éxito', mensaje: 'Colmena registrada con éxito', tipo: 'success' });
                setIsModalOpen(true);
                // Limpiar campos específicos después del éxito
                setColmena(prev => ({ ...prev, id_colmena_usuario: '', tipo_colmena: '', estado: '', id_colmena_madre: '' }));
                setSearchTermMadre('');
            } else {
                setModalInfo({ titulo: 'Error', mensaje: 'Ocurrió un error al registrar la colmena.', tipo: 'error' });
                setIsModalOpen(true);
            }
        } catch (err) {
            setModalInfo({ titulo: 'Error de Conexión', mensaje: err.message || 'No se pudo conectar con el servidor.', tipo: 'error' });
            setIsModalOpen(true);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="main-container">
            <div className="left-panel">
                <div className="pattern-overlay"></div>
                <div className="overlay-content">
                    <div className="colmena-icon">
                        <img src={imagenColmena} alt="Logo" className="panel-img" />
                    </div>
                    <h2>Nuestras Colmenas</h2>
                    <p>El corazón del apiario reside en la fuerza y salud de sus colmenas.</p>
                </div>
            </div>

            <div className="right-panel">
                <div className="form-wrapper">
                    <div className="header-inline">
                        <h1 className="main-title">REGISTRAR <span>COLMENA</span></h1>
                    </div>

                    <form onSubmit={registrar} className="login-form">
                        <div className="input-group">
                            <label htmlFor="id_colmena_usuario">Identificador / Marca Propia</label>
                            <input
                                type="text"
                                id="id_colmena_usuario"
                                name="id_colmena_usuario"
                                placeholder="Ej: COL-001-2024"
                                value={colmena.id_colmena_usuario}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="tipo_colmena">Tipo de Colmena</label>
                            <select
                                id="tipo_colmena"
                                name="tipo_colmena"
                                value={colmena.tipo_colmena}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="" disabled>Seleccione un tipo</option>
                                <option value="Langstroth">Langstroth</option>
                                <option value="Dadant">Dadant</option>
                                <option value="Keniana">Keniana</option>
                                <option value="Layens">Layens</option>
                                <option value="Nucleo">Núcleo</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="estado">Estado Inicial</label>
                            <select
                                id="estado"
                                name="estado"
                                value={colmena.estado}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="" disabled>Seleccione un estado</option>
                                <option value="Nucleo">Núcleo</option>
                                <option value="Crecimiento">Crecimiento</option>
                                <option value="Mantenimiento">Mantenimiento</option>
                                <option value="Produccion">Producción</option>
                                <option value="Vencimiento">Vencimiento</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="fecha_inicio">Fecha de Instalación</label>
                            <input
                                type="date"
                                id="fecha_inicio"
                                name="fecha_inicio"
                                value={colmena.fecha_inicio}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="apiario_id">Asignar a Apiario</label>
                            <select
                                id="apiario_id"
                                name="apiario_id"
                                value={colmena.apiario_id}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="" disabled>Seleccione un apiario</option>
                                {apiarios.map((apiario) => (
                                    <option key={apiario.id} value={apiario.id}>
                                       {apiario.nombre_referencia} 
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group checkbox-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                id="es_enjambre"
                                name="es_enjambre"
                                checked={colmena.es_enjambre}
                                onChange={manejarCambio}
                                style={{ width: 'auto' }}
                            />
                            <label htmlFor="es_enjambre" style={{ margin: 0 }}>¿Es un enjambre?</label>
                        </div>

                        {!colmena.es_enjambre && (
                            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                                <div className="input-group">
                                    <label htmlFor="id_colmena_madre">Colmena Madre (Marca o Identificador)</label>
                                    <input
                                        type="text"
                                        id="id_colmena_madre"
                                        name="id_colmena_madre"
                                        list="colmenas_madre_list"
                                        placeholder="Escribe para buscar (ej: ME-22)..."
                                        value={searchTermMadre}
                                        onChange={manejarCambioMadre}
                                        required
                                    />
                                    <datalist id="colmenas_madre_list">
                                        {colmenasMadreDisponibles.map(col => (
                                            <option key={col.id} value={col.id_colmena_usuario} />
                                        ))}
                                    </datalist>
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <div className="input-group" style={{ flex: 1 }}>
                                        <label htmlFor="fecha_inicio_reina">Inicio Reina</label>
                                        <input
                                            type="date"
                                            id="fecha_inicio_reina"
                                            name="fecha_inicio_reina"
                                            value={colmena.fecha_inicio_reina}
                                            onChange={manejarCambio}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="button-group">
                            <button type="button" className="secondary-btn" onClick={() => window.history.back()}>
                                CANCELAR
                            </button>
                            <button type="submit" className="primary-btn" disabled={cargando}>
                                {cargando ? 'REGISTRANDO...' : 'GUARDAR COLMENA'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ModalMSN 
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                title={modalInfo.titulo}
                message={modalInfo.mensaje}
                type={modalInfo.tipo}
                goView={props.setViewState}
                view=""
            />
        </div>
    );
};

export default RegistrarColmena;