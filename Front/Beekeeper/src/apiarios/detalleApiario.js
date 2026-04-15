import React, { useEffect, useRef, useState } from 'react';
import './css/detalleApiario.css';

export default function DetalleApiario({ apiario, setViewState }) {
    const leftPanelRef = useRef(null);
    const [leftPanelHeight, setLeftPanelHeight] = useState(null);

    useEffect(() => {
        const measure = () => {
            if (leftPanelRef.current) {
                setLeftPanelHeight(leftPanelRef.current.getBoundingClientRect().height);
            }
        };

        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [apiario]);

    const esReinaVencida = (col) => {
        const fechaRef = col.fecha_inicio_reina || col.fecha_inicio;
        if (!fechaRef || fechaRef === "N/A") return false;
        const fechaDate = new Date(fechaRef);
        const limite = new Date();
        limite.setFullYear(limite.getFullYear() - 2);
        return fechaDate < limite;
    };

    const totalColmenas = apiario?.colmenas?.length || 0;

    if (!apiario) {
        return (
            <div className="detalle-container">
                <div className="detalle-header">
                    <button className="back-btn" onClick={() => setViewState('VerMisApiarios')}>
                        ← Volver
                    </button>
                    <h1>Detalle de Apiario</h1>
                </div>
                <div className="detalle-empty">Selecciona un apiario primero para ver sus detalles.</div>
            </div>
        );
    }

    return (
        <div className="detalle-container">
            <div className="detalle-header">
                <button className="back-btn" onClick={() => setViewState('VerMisApiarios')}>
                    ← Volver
                </button>
                <h1>Detalle de Apiario: <span>{apiario.nombre_referencia}</span></h1>
            </div>

            <div className="detalle-grid">
                <section className="detalle-left-panel" ref={leftPanelRef}>
                    <div className="overlay-content">
                        <div className="bee-icon">
                            <img src="https://cdn-icons-png.flaticon.com/512/517/517563.png" alt="Abeja" />
                        </div>
                        <h2>Apiario</h2>
                        <p>Información general y cantidad total de colmenas.</p>
                    </div>

                    <div className="detalle-card info-card">
                        <h2>Información general</h2>
                        <div className="info-row">
                            <span>Nombre</span>
                            <strong>{apiario.nombre_referencia}</strong>
                        </div>
                        <div className="info-row">
                            <span>ID</span>
                            <strong>{apiario.id ?? 'N/A'}</strong>
                        </div>
                        <div className="info-row">
                            <span>Altitud</span>
                            <strong>{apiario.msnm ?? 'Sin datos'} MSNM</strong>
                        </div>
                        <div className="info-row">
                            <span>Coordenadas</span>
                            <strong>{apiario.coordenadas ?? 'Sin datos'}</strong>
                        </div>
                        <div className="info-row">
                            <span>Fecha de Creación</span>
                            <strong>{apiario.fecha_creacion ? apiario.fecha_creacion.split('T')[0] : 'Sin datos'}</strong>
                        </div>
                        <div className="info-row">
                            <span>Capacidad Máxima</span>
                            <strong>{apiario.capacidad_maxima ?? 'Sin datos'}</strong>
                        </div>
                        <div className="info-row">
                            <span>Estado</span>
                            <strong>{apiario.activo === false ? 'Inactivo' : 'Activo'}</strong>
                        </div>
                        <div className="info-row info-block">
                            <span>Tipo de Flora</span>
                            <strong>{apiario.tipo_flora ?? 'Sin datos'}</strong>
                        </div>
                        <div className="info-row info-block">
                            <span>Descripción de Vía</span>
                            <strong>{apiario.descripcion_acceso ?? 'Sin datos'}</strong>
                        </div>
                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                            <button className="perfil-btn" onClick={() => setViewState('ModificarApiario')}>
                                Editar Apiario
                            </button>
                        </div>
                    </div>
                </section>

                <section className="detalle-right-panel">
                    <div
                        className="detalle-card colmenas-card"
                        style={leftPanelHeight ? { maxHeight: `${leftPanelHeight}px` } : undefined}
                    >
                        <div className="section-title">
                            <h2>Colmenas</h2>
                            <span>{totalColmenas} colmenas registradas</span>
                        </div>
                        <div className="colmenas-list">
                            {apiario.colmenas?.map(colmena => (
                                <article key={colmena.id} className={`colmena-card ${esReinaVencida(colmena) ? 'vencida-border' : ''}`}>
                                    <div>
                                        <h3>{colmena.id_colmena_usuario}</h3>
                                        <p>Tipo: {colmena.tipo_colmena}</p>
                                    </div>
                                    <div className="colmena-meta">
                                        <span>Estado: {colmena.estado}</span>
                                        <span className={esReinaVencida(colmena) ? 'text-vencida' : ''}>
                                            {esReinaVencida(colmena) ? '⚠️ REEMPLAZO REINA' : colmena.estado}
                                        </span>
                                        <span>Inicio: {colmena.fecha_inicio?.split('T')[0]}</span>
                                        <span>Reina: {colmena.fecha_inicio_reina?.split('T')[0] || 'N/A'}</span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
