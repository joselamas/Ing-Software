import React from 'react';
import { useVerColmenas } from './hooks/useVerColmenas';
import './css/verColmenas.css';

const VerColmenas = (props) => {
    const { colmenas, cargando, error } = useVerColmenas(props.usr);

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
                                <th>ID</th>
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
                                    <td><strong>#{c.id}</strong></td>
                                    <td>{c.apiario}</td>
                                    <td>{c.tipo_colmena}</td>
                                    <td>
                                        {c.es_enjambre ? 
                                            <span className="badge swarm">Enjambre</span> : 
                                            <span className="badge division">División (Madre: {c.id_colmena_madre})</span>
                                        }
                                    </td>
                                    <td>{c.fecha_inicio}</td>
                                    <td>{c.fecha_inicio_reina || "N/A"}</td>
                                    <td>
                                        <span className={`status-pill ${c.estado.toLowerCase().replace(" ", "-")}`}>
                                            {c.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="icon-btn edit">✎</button>
                                        <button className="icon-btn delete">✖</button>
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