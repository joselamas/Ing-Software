import React from 'react';
import './css/DetalleColmena.css';

const DetalleColmena = ({ colmena, setViewState }) => {
    // Validación de seguridad para evitar errores si no hay datos
    if (!colmena) {
        setViewState("VerMisColmenas");
        return null;
    }

    const { colmena: info, nombre_apiario } = colmena;

    return (
        <div className="gestion-container">
            <header className="perfil-header">
                <div>
                    <h1>Detalles <span>Colmena</span></h1>
                    <p>ID: <strong>{info.id_colmena_usuario}</strong> | Apiario: {nombre_apiario || "Sin asignar"}</p>
                </div>
                <button className="perfil-btn" onClick={() => setViewState("VerMisColmenas")}>
                    ← Volver
                </button>
            </header>

            <div className="detalle-grid">
                {/* Panel de Información General */}
                <section className="detalle-card info-general">
                    <h3>Información General</h3>
                    <div className="info-item"><span>Tipo:</span> {info.tipo_colmena}</div>
                    <div className="info-item"><span>Estado:</span> {info.estado}</div>
                    <div className="info-item"><span>Origen:</span> {info.es_enjambre ? "Enjambre" : "División"}</div>
                    <div className="info-item"><span>Instalación:</span> {info.fecha_inicio?.split('T')[0]}</div>
                </section>

                {/* Panel de Producción */}
                <section className="detalle-card produccion">
                    <h3>Producción Reciente</h3>
                    {info.produccion && info.produccion.length > 0 ? (
                        info.produccion.map((prod, index) => (
                            <div key={index} className="info-item">
                                <span>{prod.fecha?.split('T')[0]}:</span> {prod.cantidad}kg ({prod.tipo_producto})
                            </div>
                        ))
                    ) : (
                        <div className="placeholder-text">No hay registros de producción recientes.</div>
                    )}
                </section>

                {/* Panel de Alimentación - DINÁMICO */}
                <section className="detalle-card alimentacion">
                    <h3>Alimentación</h3>
                    {info.alimentacion && info.alimentacion.length > 0 ? (
                        info.alimentacion.map((al, index) => (
                            <div key={index} className="info-item">
                                <span>{al.fecha?.split('T')[0]}:</span> {al.alimento} ({al.cantidad})
                            </div>
                        ))
                    ) : (
                        <div className="placeholder-text">No hay registros de alimentación.</div>
                    )}
                </section>

                {/* Historial de Revisiones - DINÁMICO */}
                <section className="detalle-card historial full-width">
                    <h3>Historial de Revisiones</h3>
                    <table className="neobrutalist-table mini">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Observación</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {info.revisiones && info.revisiones.length > 0 ? (
                                info.revisiones.map((rev, index) => (
                                    <tr key={index}>
                                        <td>{rev.fecha?.split('T')[0]}</td>
                                        <td>{rev.detalle || "Sin observaciones"}</td>
                                        <td>{rev.estado_salud}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" style={{textAlign: 'center'}}>No hay revisiones registradas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
};

export default DetalleColmena;