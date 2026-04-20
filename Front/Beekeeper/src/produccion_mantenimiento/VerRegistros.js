import React, { useState } from 'react';
import { useVerRegistros } from './hooks/useVerRegistros';
import './css/verRegistros.css';

const VerRegistros = ({ usr, setViewState }) => {
    const {
        activeTab, setActiveTab, loading, filters, handleFilterChange, clearFilters,
        dataPaginada, totalResults, currentPage, setCurrentPage, totalPages, itemsPerPage, setItemsPerPage
    } = useVerRegistros(usr);

    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="gestion-container">
            <header className="perfil-header list-header">
                <div>
                    <h1>Historial de <span>Actividad</span></h1>
                    <p>Consulta el registro histórico de tus cosechas y alimentación.</p>
                </div>
                <div className="header-actions">
                    <button className={`perfil-btn ${showFilters ? 'active-filter' : ''}`} onClick={() => setShowFilters(!showFilters)}>
                        {showFilters ? '✕ Cerrar Filtros' : '🔍 Filtros'}
                    </button>
                    <div className="tabs-main-nav">
                        <button className={`tab-nav-btn ${activeTab === 'cosecha' ? 'active' : ''}`} onClick={() => setActiveTab('cosecha')}>🍯 Cosechas</button>
                        <button className={`tab-nav-btn ${activeTab === 'alimentacion' ? 'active' : ''}`} onClick={() => setActiveTab('alimentacion')}>🥞 Alimentación</button>
                    </div>
                </div>
            </header>

            {showFilters && (
                <div className="filters-section animate-fade-in">
                    <div className="filters-grid">
                        <div className="input-group">
                            <label>Apiario</label>
                            <input type="text" name="apiario" value={filters.apiario} onChange={handleFilterChange} placeholder="Nombre apiario..." />
                        </div>
                        <div className="input-group">
                            <label>Colmena</label>
                            <input type="text" name="colmena" value={filters.colmena} onChange={handleFilterChange} placeholder="ID Colmena..." />
                        </div>
                        <div className="input-group">
                            <label>Producto/Suministro</label>
                            <select name="tipo" value={filters.tipo} onChange={handleFilterChange}>
                                <option value="">Todos</option>
                                {activeTab === 'cosecha' ? (
                                    <><option value="Miel">Miel</option><option value="Polen">Polen</option></>
                                ) : (
                                    <><option value="Jarabe">Jarabe</option><option value="Torta Proteica">Torta</option><option value="Polen">Polen</option></>
                                )}
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Desde</label>
                            <input type="date" name="fechaDesde" value={filters.fechaDesde} onChange={handleFilterChange} />
                        </div>
                        <div className="input-group">
                            <label>Hasta</label>
                            <input type="date" name="fechaHasta" value={filters.fechaHasta} onChange={handleFilterChange} />
                        </div>
                    </div>
                    <div className="filter-footer">
                        <button className="secondary-btn btn-clear-filters" onClick={clearFilters}>Limpiar Filtros</button>
                    </div>
                </div>
            )}

            <div className="table-wrapper">
                {loading ? (
                    <div className="loading-state">Cargando registros...</div>
                ) : (
                    <table className="neobrutalist-table">
                        <thead>
                            {activeTab === 'cosecha' ? (
                                <tr>
                                    <th>FECHA</th>
                                    <th>COLMENA</th>
                                    <th>APIARIO</th>
                                    <th>PRODUCTO</th>
                                    <th>ORIGEN</th>
                                    <th>CANTIDAD (KG)</th>
                                    <th>PRECIO UNIT.</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th>FECHA</th>
                                    <th>COLMENA</th>
                                    <th>APIARIO</th>
                                    <th>SUMINISTRO</th>
                                    <th>DETALLE/MEZCLA</th>
                                    <th>CANTIDAD</th>
                                    <th>COSTO TOTAL</th>
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {dataPaginada.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.fecha?.split('T')[0]}</td>
                                    <td><strong>{item.id_colmena_usuario}</strong></td>
                                    <td>{item.nombre_apiario}</td>
                                    <td><span className={`badge ${activeTab}`}>{activeTab === 'cosecha' ? item.tipo_producto : item.tipo_suministro}</span></td>
                                    <td>{activeTab === 'cosecha' ? item.tipo_origen : item.detalle_mezcla}</td>
                                    <td>{activeTab === 'cosecha' ? item.cantidad_kg : item.cantidad}</td>
                                    <td>${activeTab === 'cosecha' ? item.precio_aprox_kg : item.precio_total_insumo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="table-footer">
                <div className="items-per-page">
                    <label>Ver:</label>
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="items-select">
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                    <span className="results-count">Registros encontrados: {totalResults}</span>
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>« Anterior</button>
                        <span className="page-info">Página {currentPage} de {totalPages}</span>
                        <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Siguiente »</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerRegistros;