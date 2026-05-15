import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Chart } from "react-google-charts";
import { useEstadisticas } from './hooks/useEstadisticas';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './css/estadisticas.css';
import '../colmenas/css/verColmenas.css'; // Importamos estilos de paginación compartidos

const Estadisticas = ({ usr }) => {
    const { stats, annualStats, loading, formatMoneda } = useEstadisticas(usr);
    const reportRef = useRef();

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isExporting, setIsExporting] = useState(false);
    const [activeTab, setActiveTab] = useState("General");

    // Formatear datos para Google Charts
    const chartData = useMemo(() => {
        if (!stats || !stats.comparativaMeses || stats.comparativaMeses.length === 0) {
            return null;
        }

        // Si estamos en un año específico, filtramos los meses de ese año
        let rawData = stats.comparativaMeses;
        if (activeTab !== "General") {
            rawData = rawData.filter(m => String(m.mes).startsWith(activeTab));
        }

        if (rawData.length === 0) return null;

        const header = ["Mes", "Miel", "Polen", "Líquido", "Sólido"];
        const rows = rawData.map(m => [
            String(m.mes),
            Number(m.miel),
            Number(m.polen),
            Number(m.liquido),
            Number(m.solido) || 0
        ]);
        return [header, ...rows];
    }, [stats, activeTab]);

    // Obtener los datos resumidos según la pestaña activa
    const displaySummary = useMemo(() => {
        if (activeTab === "General") {
            return {
                roi: stats.roi,
                produccion: stats.produccionTotal,
                gastos: stats.gastoTotal
            };
        }
        const yearData = annualStats.find(a => String(a.anio) === activeTab);
        if (!yearData) return null;

        const ingresos = yearData.mielValor + yearData.polenValor;
        const egresos = yearData.jarabeValor + yearData.tortaValor;
        
        return {
            roi: {
                // Calculamos el ROI general para el año específico
                porcentaje: egresos > 0 ? Number((((ingresos - egresos) / egresos) * 100).toFixed(2)) : 0,
                beneficio: ingresos - egresos,
                ingresos,
                egresos
            },
            produccion: { miel: yearData.mielKg, polen: yearData.polenKg },
            gastos: { liquido: yearData.jarabeKg, solido: yearData.tortaKg }
        };
    }, [stats, annualStats, activeTab]);

    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);

    const paginatedRanking = useMemo(() => {
        if (!stats) return [];
        const inicio = (currentPage - 1) * itemsPerPage;
        return stats.rankingElite.slice(inicio, inicio + itemsPerPage);
    }, [stats, currentPage, itemsPerPage]);

    const totalPages = stats ? Math.ceil(stats.rankingElite.length / itemsPerPage) : 0;

    const handleDownloadPDF = async () => {
        setIsExporting(true);
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        window.scrollTo(0, 0);

        const element = reportRef.current;
        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#fdfaf5",
                windowHeight: 5000, // Alto virtual suficiente para capturar las 50 filas expandidas
                onclone: (clonedDoc) => {
                    // 1. Eliminar patrón de panal y forzar fondo limpio
                    const styleTag = clonedDoc.createElement('style');
                    styleTag.innerHTML = `
                        .gestion-container::before { display: none !important; }
                        .gestion-container { 
                            background: #fdfaf5 !important; 
                            background-image: none !important;
                        }
                    `;
                    clonedDoc.head.appendChild(styleTag);

                    // Limpieza profunda de estilos para evitar el error "unsupported color function"
                    const elements = clonedDoc.querySelectorAll('*');
                    elements.forEach(el => {
                        const style = window.getComputedStyle(el);
                        const props = ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'];
                        
                        props.forEach(prop => {
                            const value = style[prop];
                            // Si el valor contiene 'color(' es una función moderna que html2canvas no soporta
                            if (value && value.includes('color(')) {
                                // Forzamos un color sólido básico para que la librería no se rompa
                                el.style[prop] = (prop === 'backgroundColor' || prop === 'fill') ? 'transparent' : '#2e1a12';
                            }
                        });
                    });

                    const container = clonedDoc.querySelector('.gestion-container');
                    if (container) {
                        container.style.backgroundColor = "#fdfaf5";
                        container.style.height = 'auto';
                        container.style.minHeight = 'auto';
                        container.style.overflow = 'visible';
                    }

                    // 2. Forzar que la tabla muestre TODO el ranking en el PDF
                    const tableBody = clonedDoc.querySelector('.neobrutalist-table tbody');
                    if (tableBody && stats?.rankingElite) {
                        tableBody.innerHTML = ''; // Limpiar filas paginadas
                        stats.rankingElite.forEach((hive, idx) => {
                            const tr = clonedDoc.createElement('tr');
                            tr.innerHTML = `
                                <td><strong>#${idx + 1}</strong></td>
                                <td>${hive.id_colmena}</td>
                                <td>${hive.apiario}</td>
                                <td>${hive.msnm} <small>msnm</small></td>
                                <td>${hive.fechaInicio ? hive.fechaInicio.split('T')[0] : 'N/A'}</td>
                                <td>${hive.produccion} Kg</td>
                            `;
                            tableBody.appendChild(tr);
                        });
                    }
                }
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            const pageHeight = pdf.internal.pageSize.getHeight();

            let heightLeft = pdfHeight;
            let position = 0;

            // Primera página
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            // Generar páginas adicionales automáticamente si el contenido es largo
            while (heightLeft > 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Analisis_Rendimiento_${usr?.acronimo || 'Beekeeper'}.pdf`);
        } catch (error) {
            console.error("Error al generar PDF:", error);
        }

        window.scrollTo(scrollX, scrollY);
        setIsExporting(false);
    };

    if (loading) return <div className="loading-state">Calculando rendimientos...</div>;

    return (
        <div className="gestion-container" ref={reportRef}>
            <header className="perfil-header">
                <div>
                    <h1>Relación <span>Consumo / Producción</span></h1>
                    <p>Monitoreo de productividad, costos .</p>
                </div>
                <button 
                    onClick={handleDownloadPDF} 
                    className="page-btn" 
                    style={{ alignSelf: 'center' }}
                    disabled={isExporting}
                    data-html2canvas-ignore
                >
                    {isExporting ? 'Procesando...' : 'Exportar Reporte'}
                </button>
            </header>

            {/* SISTEMA DE PESTAÑAS */}
            <div className="tabs-container" style={{ display: 'flex', gap: '10px', marginBottom: '25px', overflowX: 'hidden', paddingBottom: '10px' }}>
                <button 
                    className={`tab-btn ${activeTab === 'General' ? 'active' : ''}`}
                    onClick={() => setActiveTab('General')}
                    style={{ padding: '10px 20px', borderRadius: '8px', border: '3px solid var(--dark-brown)', fontWeight: '800', backgroundColor: activeTab === 'General' ? 'var(--primary-yellow)' : 'white', cursor: 'pointer' }}
                >
                    GENERAL (HISTÓRICO)
                </button>
                {annualStats.map(year => (
                    <button 
                        key={year.anio}
                        className={`tab-btn ${activeTab === String(year.anio) ? 'active' : ''}`}
                        onClick={() => setActiveTab(String(year.anio))}
                        style={{ padding: '10px 20px', borderRadius: '8px', border: '3px solid var(--dark-brown)', fontWeight: '800', backgroundColor: activeTab === String(year.anio) ? 'var(--primary-yellow)' : 'white', cursor: 'pointer' }}
                    >
                        AÑO {year.anio}
                    </button>
                ))}
            </div>

            {displaySummary && (
            <div className="stats-grid-dashboard">
                <div className="stat-card highlight">
                    <label style={{fontSize:'2rem'}}>Relación Inversión Alimentación / Producción {activeTab === 'General' ? '(General)' : `(${activeTab})`}</label>
                    <h2>{displaySummary.roi.porcentaje}%</h2>
                    <div className="roi-badge">Neto: {formatMoneda(displaySummary.roi.beneficio)}</div>
                    <p style={{fontSize: '1.3rem', marginTop: '10px', color: 'var(--dark-brown)'}}>
                        Basado en {formatMoneda(displaySummary.roi.ingresos)} ingresos vs {formatMoneda(displaySummary.roi.egresos)} egresos.
                    </p>
                </div>

                <div className="stat-card">
                    <label>Producción {activeTab === 'General' ? 'Total' : `del Año ${activeTab}`} vs Alimentación {activeTab === 'General' ? 'Total' : `del Año ${activeTab}`}</label>
                    <div className="production-split-container">
                        <div className="prod-box honey">
                            <span className="prod-value">{displaySummary.produccion.miel}</span>
                            <span className="prod-label">Kg Miel</span>
                        </div>
                        <div className="prod-box pollen">
                            <span className="prod-value">{displaySummary.produccion.polen}</span>
                            <span className="prod-label">Kg Polen</span>
                        </div>
                    </div>
                    <div className="production-split-container" style={{ marginTop: '15px' }}>
                        <div className="prod-box liquid">
                            <span className="prod-value">{displaySummary.gastos.liquido}</span>
                            <span className="prod-label">Líquido</span>
                        </div>
                        <div className="prod-box solid">
                            <span className="prod-value">{displaySummary.gastos.solido}</span>
                            <span className="prod-label">Sólido</span>
                        </div>
                    </div>
                </div>

                {/* La gráfica de tendencia solo se muestra en la pestaña "General" */}
                {activeTab === "General" && (
                    <div className="stat-card wide-card">
                        <label>Tendencia Histórica</label>
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
                                        pointSize: 6,
                                        lineWidth: 3,
                                        colors: ["#f59e0b", "#10b981", "#3b82f6", "#ef4444"],
                                        chartArea: { width: "85%", height: "70%" },
                                        hAxis: {
                                            textStyle: { fontSize: 10 },
                                            gridlines: { color: "transparent" }
                                        },
                                        vAxis: {
                                            minValue: 0,
                                            gridlines: { color: "#f3f4f6" }
                                        },
                                        legend: { position: "top", textStyle: { fontSize: 11, fontWeight: "bold" } }
                                    }}
                                />
                            ) : (
                                <div className="no-data-msg">No hay datos históricos para graficar</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            )}

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

            <div className="table-footer" data-html2canvas-ignore>
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
