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

    const placeholderColmenas = Array.from({ length: 40 }, (_, index) => ({
        id: index + 1,
        nombre: `Colmena ${index + 1}`,
        tipo: ['Langstroth', 'Dadant', 'Núcleo'][index % 3],
        produccion_kg: [24, 18, 0, 12, 15][index % 5],
        estado: index % 5 === 2 ? 'En mantenimiento' : 'Activa',
    }));

    const totalColmenas = placeholderColmenas.length;

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
                            <strong>{apiario.fecha_creacion ? new Date(apiario.fecha_creacion).toLocaleDateString() : 'Sin datos'}</strong>
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
                    </div>
                </section>

                <section className="detalle-right-panel">
                    <div
                        className="detalle-card colmenas-card"
                        style={leftPanelHeight ? { maxHeight: `${leftPanelHeight}px` } : undefined}
                    >
                        <div className="section-title">
                            <h2>Colmenas</h2>
                            <span>{totalColmenas} registros temporales</span>
                        </div>
                        <div className="colmenas-list">
                            {placeholderColmenas.map(colmena => (
                                <article key={colmena.id} className="colmena-card">
                                    <div>
                                        <h3>{colmena.nombre}</h3>
                                        <p>{colmena.tipo}</p>
                                    </div>
                                    <div className="colmena-meta">
                                        <span>{colmena.estado}</span>
                                        <strong>{colmena.produccion_kg} kg</strong>
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
