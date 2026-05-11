import React from 'react';
import { useMiPerfil } from './hooks/useMiPerfil.js';
import './css/miPerfil.css';

export default function MiPerfil({ usr, setViewState }) {
    const { stats, loading, error } = useMiPerfil(usr);

    if (loading) return <div className="mensajePerfil">Cargando información de perfil...</div>;
    if (error) return <div className="errorPerfil">{error}</div>;

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
                    </div>
                </section>

                <section className="perfil-card produccion-card">
                    <h2>Producción</h2>
                    <div className="estadisticas-grid">
                        
                        <div className="estadistica-item">
                            <span>Kg producidos 2024</span> {/* Asumiendo que kgAnual[0] es para 2024 */}
                            <strong>{stats.kgAnual[0]}</strong>
                        </div>
                        <div className="estadistica-item">
                            <span>Kg producidos 2025</span> {/* Asumiendo que kgAnual[1] es para 2025 */}
                            <strong>{stats.kgAnual[1]}</strong>
                        </div>
                        <div className="estadistica-item">
                            <span>Kg producidos 2026</span> {/* Asumiendo que kgAnual[2] es para 2026 */}
                            <strong>{stats.kgAnual[2]}</strong>
                        </div>
                        
                        <div className="estadistica-item">
                            <span>Costos 2024</span>
                            <strong>{stats.kgAnual[0]}</strong> {/* Usando el mismo valor temporalmente */}
                        </div>
                        <div className="estadistica-item">
                            <span>Costos 2025</span>
                            <strong>{stats.kgAnual[1]}</strong>
                        </div>
                        <div className="estadistica-item">
                            <span>Costos 2026</span>
                            <strong>{stats.kgAnual[2]}</strong>
                          </div>
                        
                        <div className="estadistica-item">
                            <span>Rentabilidad 2024</span>
                            <strong>{stats.kgAnual[0]}</strong>
                        </div>
                        <div className="estadistica-item">
                            <span>Rentabilidad 2025</span>
                            <strong>{stats.kgAnual[1]}</strong>
                        </div>
                        <div className="estadistica-item">
                            <span>Rentabilidad 2026</span>
                            <strong>{stats.kgAnual[2]}</strong>
                        </div>
                    </div>
                        
                </section>
            </div>

            <div className="perfil-summary">
                <div className="summary-card">
                    <h3>Apiarios</h3>
                    <div className="summary-block">
                        <span>Total</span>
                        <strong>{stats.totalApiarios}</strong>
                    </div>
                    <div className="summary-block">
                        <span>Activos</span>
                        <strong>{stats.totalApiarios}</strong> {/* Asumiendo que todos los listados son activos por ahora */}
                    </div>
                </div>
                <div className="summary-card">
                    <h3>Colmenas</h3>
                    <div className="summary-block">
                        <span>Activas</span>
                        <strong>{stats.activas}</strong>
                    </div>
                    <div className="summary-block">
                        <span>Históricas</span>
                        <strong>{stats.historicas}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}
