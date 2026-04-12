import React from 'react';
import { useVerColmenas } from './hooks/useVerColmenas';
import './css/verColmenas.css';

const VerColmenas = (props) => {
    const { colmenas, cargando, error, desactivarColmena } = useVerColmenas(props.usr);

    return (
        <div className="gestion-container">
            <header className="perfil-header list-header">
                <div>
                    <h1>Mis <span>Colmenas</span></h1>
                    <p>Resumen de tus Colmenas: estado, ubicacion,  etc.</p>
                </div>
                <button className="perfil-btn" onClick={() => props.setViewState("CrearNuevaColmenas")}>
                    + Nueva Colmena
                </button>
            </header>

            {error && <div className="error-msg">{error}</div>}

            <div className="table-wrapper">
                {cargando ? (
                    <div className="loading-state">Cargando colmenas...</div>
                ) : (
                    <table className="neobrutalist-table">
                        <thead>
                            <tr>
                                <th>MARCA</th>
                                <th>APIARIO</th>
                                <th>TIPO</th>
                                <th>ORIGEN</th>
                                <th>INSTALACIÓN</th>
                                <th>INICIO REINA</th>
                                <th>ESTADO</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {colmenas.map((c) => (
                                <tr key={c.id}>
                                    <td><strong>{c.colmena.id_colmena_usuario }</strong></td>
                                    <td>{c.nombre_apiario ||  "Sin Apiario"}</td>
                                    <td>{c.colmena.tipo_colmena}</td>
                                    <td>
                                        {(c.colmena.es_enjambre ) ? 
                                            <span className="badge swarm">Enjambre</span> : 
                                            <span className="badge division">División (Madre: {c.colmena.id_colmena_madre})</span>
                                        }
                                    </td>
                                    <td>{c.colmena.fecha_inicio?.split('T')[0]}</td>
                                    <td>{c.colmena.fecha_inicio_reina?.split('T')[0] || "N/A"}</td>
                                    <td>
                                        <span className={`status-pill ${c.estado ? c.estado.toLowerCase().replace(/\s+/g, "-") : 'desconocido'}`}>
                                            {c.colmena.estado || 'N/A'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="icon-btn edit" onClick={() => {
                                            props.setSelectedColmena(c);
                                            props.setSelectedApiarioID(c.apiario_id);
                                            props.setViewState("ModificarColmena");
                                        }}>✎</button>
                                        <button className="icon-btn delete" onClick={() => desactivarColmena(c.colmena.id)}>
                                            ✖
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default VerColmenas;