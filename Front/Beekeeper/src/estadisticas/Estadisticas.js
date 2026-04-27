import React, { useState, useMemo, useEffect } from 'react';
import { Chart } from "react-google-charts";
import { useEstadisticas } from './hooks/useEstadisticas';
import './css/estadisticas.css';
import '../colmenas/css/verColmenas.css'; // Importamos estilos de paginación compartidos

const Estadisticas = ({ usr }) => {
    const { stats, loading, formatMoneda } = useEstadisticas(usr);

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Formatear datos para Google Charts
    const chartData = useMemo(() => {
        if (!stats || !stats.comparativaMeses || stats.comparativaMeses.length === 0) {
            return null;
        }
        const header = ["Mes", "Miel", "Polen", "Líquido", "Sólido"];
        const rows = stats.comparativaMeses.map(m => [
            String(m.mes),
            Number(m.miel),
            Number(m.polen),
            Number(m.liquido),
            Number(m.solido) || 0
        ]);
        return [header, ...rows];
    }, [stats]);

    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);

    const paginatedRanking = useMemo(() => {
        if (!stats) return [];
        const inicio = (currentPage - 1) * itemsPerPage;
        return stats.rankingElite.slice(inicio, inicio + itemsPerPage);
    }, [stats, currentPage, itemsPerPage]);

    const totalPages = stats ? Math.ceil(stats.rankingElite.length / itemsPerPage) : 0;

    if (loading) return <div className="loading-state">Calculando rendimientos...</div>;

    return (
        <div className="gestion-container">
            <header className="perfil-header">
                <div>
                    <h1>Análisis de <span>Rendimiento</span></h1>
                    <p>Monitoreo de productividad, costos y Retorno de Inversión (ROI).</p>
                </div>
            </header>

            <div className="stats-grid-dashboard">
                <div className="stat-card highlight">
                    <label style={{fontSize:'2rem'}}>Retorno de Inversión (ROI)</label>
                    <h2>{stats.roi.porcentaje}%</h2>
                    <div className="roi-badge">Neto: {formatMoneda(stats.roi.beneficio)}</div>
                    <p style={{fontSize: '1.3rem', marginTop: '10px', color: 'var(--dark-brown)'}}>
                        Basado en {formatMoneda(stats.roi.ingresos)} ingresos vs {formatMoneda(stats.roi.egresos)} egresos.
                    </p>
                </div>

                <div className="stat-card">
                    <label>Producción vs Alimentación</label>
                    <div className="production-split-container">
                        <div className="prod-box honey">
                            <span className="prod-value">{stats.produccionTotal.miel}</span>
                            <span className="prod-label">Kg Miel</span>
                        </div>
                        <div className="prod-box pollen">
                            <span className="prod-value">{stats.produccionTotal.polen}</span>
                            <span className="prod-label">Kg Polen</span>
                        </div>
                    </div>
                    <div className="production-split-container" style={{ marginTop: '15px' }}>
                        <div className="prod-box liquid">
                            <span className="prod-value">{stats.gastoTotal.liquido}</span>
                            <span className="prod-label">Líquido</span>
                        </div>
                        <div className="prod-box solid">
                            <span className="prod-value">{stats.gastoTotal.solido}</span>
                            <span className="prod-label">Sólido</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card wide-card">
                    <label>Tendencia: Producción vs Consumo</label>
                   <div className="chart-wrapper-google">
    {chartData && chartData.length > 1 ? (
        <Chart
            chartType="LineChart"
            width="100%"
            height="350px"
            data={chartData}
            // Agrega esto para evitar errores de redimensionamiento
            loader={<div>Cargando Gráfico...</div>} 
            options={{
                curveType: "function",
                pointSize: 8,
                lineWidth: 1,
                // ... tus otros options
            }}
        />
    ) : (
        <div className="no-data-msg">No hay datos históricos para graficar</div>
        )}
</div>
                </div>
            </div>

            <section className="elite-ranking-container animate-fade-in">
                <h3>🏆 Ranking de Colmenas Élite</h3>
                <table className="neobrutalist-table">
                    <thead>
                        <tr>
                            <th>Rango</th>
                            <th>Colmena</th>
                            <th>Apiario</th>
                            <th>Altitud</th>
                            <th>Fecha Inicio</th>
                            <th>Total Cosecha (Kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedRanking.map((hive, index) => (
                            <tr key={hive.id_colmena}>
                                <td><strong>#{(currentPage - 1) * itemsPerPage + index + 1}</strong></td>
                                <td>{hive.id_colmena}</td>
                                <td>{hive.apiario}</td>
                                <td>{hive.msnm} <small>msnm</small></td>
                                <td>{hive.fechaInicio ? hive.fechaInicio.split('T')[0] : 'N/A'}</td>
                                <td>{hive.produccion} Kg</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <div className="table-footer">
                <div className="items-per-page">
                    <label style={{color: 'var(--dark-brown)'}}>Ver:</label>
                    <select 
                        value={itemsPerPage} 
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="items-select"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                    <span className="results-count" style={{color: 'var(--dark-brown)'}}>
                        de {stats.rankingElite.length} colmenas élite
                    </span>
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                            « Anterior
                        </button>
                        <span className="page-info">Página {currentPage} de {totalPages}</span>
                        <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                            Siguiente »
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Estadisticas;
