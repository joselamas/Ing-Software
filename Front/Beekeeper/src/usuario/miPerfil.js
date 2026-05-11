import React from 'react';
import { useMiPerfil } from './hooks/useMiPerfil.js';
import './css/miPerfil.css';

export default function MiPerfil({ usr, setViewState }) {
    const { stats, loading, error } = useMiPerfil(usr);

    if (loading) return <div className="mensajePerfil">Cargando información de perfil...</div>;
    if (error) return <div className="errorPerfil">{error}</div>;

    const renderValor = (valor, decimales = 2) => {
        if (typeof valor === 'number') {
            return valor % 1 === 0 ? valor.toLocaleString() : valor.toFixed(decimales);
        }
        return valor || '0';
    };

    return (
        <div className="perfil-page">
            <header className="perfil-header">
                <div>
                    <h1>Mi <span>Perfil</span></h1>
                    <p>Resumen de tus apiarios, colmenas y producción.</p>
                </div>
                <button className="perfil-btn" onClick={() => setViewState('ActualizarDatos')}>
                    Actualizar  Perfil
                </button>
            </header>

            <div className="perfil-grid">
                <section className="perfil-card personal-card">
                    <h2>Datos personales</h2>
                    <div className="perfil-info">
                        <div>
                            <span>Acrónimo</span>
                            <strong>{usr.acronimo}</strong>
                        </div>
                        <div>
                            <span>Nombre</span>
                            <strong>{usr.nombre} {usr.apellido}</strong>
                        </div>
                        <div>
                            <span>Correo</span>
                            <strong>{usr.correo}</strong>
                        </div>
                        <div>
                            <span>Teléfono</span>
                            <strong>{usr.telefono || 'No registrado'}</strong>
                        </div>
                        <div>
                            <span>Localidad</span>
                            <strong>{usr.localidad_asociada || 'No registrada'}</strong>
                        </div>
                        <div className="stat-mini highlight ">
                            <span>Apiarios Activos</span>
                            <strong>{stats.totalApiarios}</strong>
                        </div>
                        <div className="stat-mini highlight">
                            <span>Colmenas Activas</span>
                            <strong>{stats.activas}</strong>
                        </div>
                    </div>
                </section>

                <section className="perfil-card produccion-card">
                    <h2>Producción</h2>
                    <div className="produccion-container">
                        {stats.produccionAnual.map((data) => (
                        <div key={data.anio} className="anio-stats-block">
                            <h3 className="anio-title">Resumen {data.anio}</h3>
                            <div className="stats-grid-small">
                                <div className="stat-group">
                                    <div className="stat-mini"><span>Miel (Kg)</span><strong>{renderValor(data.mielKg)}</strong></div>
                                    <div className="stat-mini"><span>Jarabe (Kg)</span><strong>{renderValor(data.jarabeKg)}</strong></div>
                                    <div className="stat-mini highlight"><span>Relación Neta Miel</span><strong>{renderValor(data.relacionNetaMiel)}</strong></div>
                                    <div className="stat-mini"><span>Miel ($)</span><strong>${renderValor(data.mielValor)}</strong></div>
                                    <div className="stat-mini"><span>Jarabe ($)</span><strong>${renderValor(data.jarabeValor)}</strong></div>
                                    <div className="stat-mini highlight"><span>Relación Econ. Miel</span><strong>{renderValor(data.relacionEconomicaMiel)}</strong></div>
                                </div>
                                <div className="stat-group">
                                    <div className="stat-mini"><span>Polen (Kg)</span><strong>{renderValor(data.polenKg)}</strong></div>
                                    <div className="stat-mini"><span>Torta (Kg)</span><strong>{renderValor(data.tortaKg)}</strong></div>
                                    <div className="stat-mini highlight"><span>Relación Neta Polen</span><strong>{renderValor(data.relacionNetaPolen)}</strong></div>
                                    <div className="stat-mini"><span>Polen ($)</span><strong>${renderValor(data.polenValor)}</strong></div>
                                    <div className="stat-mini"><span>Torta ($)</span><strong>${renderValor(data.tortaValor)}</strong></div>
                                    <div className="stat-mini highlight"><span>Relación Econ. Polen</span><strong>{renderValor(data.relacionEconomicaPolen)}</strong></div>
                                </div>
                                {/* Nueva fila para el resultado económico final del año */}
                                <div className="stat-mini highlight final-economic-result">
                                    <span>Resultado Económico Final</span>
                                    <strong>${renderValor(data.mielValor + data.polenValor - data.jarabeValor - data.tortaValor)}</strong>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </section>
            </div>

            <section className="perfil-card apiarios-detalle-card" style={{ marginTop: '24px' }}>
                <h2>Detalle de Apiarios</h2>
                <table className="neobrutalist-table">
                    <thead>
                        <tr>
                            <th>Apiario</th>
                            <th>Altitud</th>
                            <th>Capacidad</th>
                            <th>Colmenas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.apiarios.length > 0 ? (
                            stats.apiarios.map((api) => (
                                <tr key={api.id}>
                                    <td><strong>{api.nombre_referencia}</strong></td>
                                    <td>{api.msnm} MSNM</td>
                                    <td>{api.capacidad_maxima ?? 'Pendiente'}</td>
                                    <td>{api.numColmenas} colmenas</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" style={{ textAlign: 'center' }}>No se encontraron apiarios registrados.</td></tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}
