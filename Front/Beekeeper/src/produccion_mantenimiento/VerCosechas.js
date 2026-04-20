import React, { useState } from 'react';
import { useVerCosechas } from './hooks/useVerCosechas';
import './css/verRegistros.css';

const VerCosechas = ({ usr, setViewState }) => {
    const {
        loading, filters, handleFilterChange, setFilters,
        dataPaginada, totalResults, currentPage, setCurrentPage, totalPages, itemsPerPage, setItemsPerPage
    } = useVerCosechas(usr);

    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="gestion-container">
            <header className="perfil-header list-header">
                <div>
                    <h1>Historial de <span>Cosechas</span></h1>
                    <p>Producción de miel y polen registrada por apiario/colmena.</p>
                </div>
                <div className="header-actions">
                    <button className={`perfil-btn ${showFilters ? 'active-filter' : ''}`} onClick={() => setShowFilters(!showFilters)}>
                        {showFilters ? '✕ Cerrar Filtros' : '🔍 Filtros'}
                    </button>
                    <button className="perfil-btn" onClick={() => setViewState('RegistrarProduccion')}>
                        + Registrar Cosecha
                    </button>
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
                            <label>Producto</label>
                            <select name="tipo" value={filters.tipo} onChange={handleFilterChange}>
                                <option value="">Todos</option>
                                <option value="Miel">Miel</option>
                                <option value="Polen">Polen</option>
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
                </div>
            )}

            <div className="table-wrapper">
                {loading ? (
                    <div className="loading-state">Consultando registros...</div>
                ) : (
                    <table className="neobrutalist-table">
                        <thead>
                            <tr>
                                <th>FECHA</th>
                                <th>COLMENA</th>
                                <th>APIARIO</th>
                                <th>PRODUCTO</th>
                                <th>ORIGEN</th>
                                <th>CANTIDAD (KG)</th>
                                <th>PRECIO UNIT.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataPaginada.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.produccion?.fecha?.split('T')[0]}</td>
                                    <td><strong>{item.id_colmena_usuario}</strong></td>
                                    <td>{item.nombre_referencia_Apiario}</td>
                                    <td><span className="status-pill produccion">{item.produccion?.tipo_producto}</span></td>
                                    <td>{item.produccion?.tipo_origen}</td>
                                    <td>{item.produccion?.cantidad_kg} Kg</td>
                                    <td>${item.produccion?.precio_aprox_kg}</td>
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
                    <span className="results-count">Cosechas: {totalResults}</span>
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>« Ant.</button>
                        <span className="page-info">Pág. {currentPage} / {totalPages}</span>
                        <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Sig. »</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerCosechas;