import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Chart } from "react-google-charts";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Hooks de datos
import { useEstadisticas } from './hooks/useEstadisticas';
import { useAnalisisApiarios } from './hooks/useAnalisisApiarios';
import { useEficienciaApiarios } from './hooks/useEficienciaApiarios';
import { useRendimientoAltura } from './hooks/useRendimientoAltura';

// Estilos
import './css/estadisticas.css';
import './css/analisisApiarios.css';
import './css/eficienciaApiarios.css';
import './css/rendimientoAltura.css';

const ReporteCompleto = ({ usr, onDownloadTriggered, onDownloadComplete }) => {
    const reportRef = useRef();
    const parte1Ref = useRef();
    const parte2Ref = useRef();
    const [isGenerating, setIsGenerating] = useState(false);

    const { stats: globalStats, loading: load1, formatMoneda } = useEstadisticas(usr);
    const { stats: apiarioStats, loading: load2 } = useAnalisisApiarios(usr);
    const { stats: eficienciaStats, loading: load3 } = useEficienciaApiarios(usr);
    const { stats: alturaStats, loading: load4 } = useRendimientoAltura(usr);

    const isLoading = load1 || load2 || load3 || load4;

    const formatearEtiquetaX = (valor) => {
        if (!valor) return "";
        const str = valor.toString().trim();
        if (str.includes('-')) {
            const partes = str.split('-');
            return `${partes[0].slice(-2)}-${partes[1]}`;
        }
        return str.length >= 4 ? str.slice(-2) : str;
    };

    const limpiarNombre = (nombre) => {
        if (!nombre) return "";
        const limpio = nombre.toString().trim();
        return limpio.substring(limpio.length - 2);
    };

    const generarPDF = useCallback(async () => {
        if (isGenerating) return;
        setIsGenerating(true);
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        window.scrollTo(0, 0);

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Configuración común para asegurar fondo blanco puro y evitar errores de color
            const opcionesCanvas = {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff", 
                logging: false,
                onclone: (clonedDoc) => {
                    const allElements = clonedDoc.querySelectorAll('*');
                    allElements.forEach(el => {
                        const style = window.getComputedStyle(el);
                        ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
                            const val = style[prop];
                            if (val && val.includes('color(')) {
                                el.style[prop] = (prop === 'backgroundColor') ? 'transparent' : '#000000';
                            }
                        });
                    });
                    
                    // Asegurar fondo blanco y márgenes en los bloques clonados para el PDF
                    ['pdf-parte-1', 'pdf-parte-2'].forEach(id => {
                        const bloque = clonedDoc.getElementById(id);
                        if (bloque) {
                            bloque.style.backgroundColor = '#ffffff';
                            bloque.style.padding = '30px'; 
                        }
                    });

                    // Ocultar botón
                    const btns = clonedDoc.querySelectorAll('.perfil-btn');
                    btns.forEach(b => b.style.display = 'none');
                }
            };

            // Función auxiliar para procesar un bloque y manejar su paginación interna si es muy largo
            const agregarBloqueAlPDF = async (element, esPrimerBloque) => {
                if (!element) {
                    throw new Error("Elemento de reporte no encontrado en el DOM");
                }
                const canvas = await html2canvas(element, opcionesCanvas);
                const imgData = canvas.toDataURL('image/png');
                const imgHeight = (canvas.height * pdfWidth) / canvas.width;
                
                let heightLeft = imgHeight;
                let position = 0;

                // Si no es el primer bloque (es decir, es la parte 2), forzamos una PÁGINA NUEVA
                if (!esPrimerBloque) {
                    pdf.addPage();
                }

                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pageHeight;

                // Si el bloque sigue siendo más grande que una página, genera las extra necesarias
                while (heightLeft > 0) {
                    position -= pageHeight; // Sube la imagen una página completa
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
            };

            // 1. Capturamos e imprimimos Secciones 1 y 2
            await agregarBloqueAlPDF(parte1Ref.current, true);
            
            // 2. Capturamos e imprimimos Secciones 3 y 4 (Comenzará obligatoriamente en página nueva)
            await agregarBloqueAlPDF(parte2Ref.current, false);

            pdf.save(`Reporte_Maestro_Beekeeper_${usr?.acronimo || 'General'}.pdf`);
        } catch (error) {
            console.error("Error al generar PDF:", error);
            alert("Error al generar el reporte PDF. Revisa la consola.");
        } finally {
            window.scrollTo(scrollX, scrollY);
            setIsGenerating(false);
        }
    }, [isGenerating, usr, globalStats, apiarioStats, eficienciaStats, alturaStats, formatMoneda]);

    // Effect to trigger PDF generation when onDownloadTriggered is true
    useEffect(() => {
        if (onDownloadTriggered && !isLoading && !isGenerating) {
            
            // Pequeño delay para asegurar que los gráficos se dibujen tras el cambio de estado
            const timer = setTimeout(() => {
                generarPDF().then(() => {
                    if (onDownloadComplete) onDownloadComplete();
                });
            }, 1500); 

            return () => clearTimeout(timer);
        }
    }, [onDownloadTriggered, isLoading, isGenerating, onDownloadComplete, generarPDF]);

    return (
        <div className="gestion-container" ref={reportRef} style={{ padding: '40px', backgroundColor: '#fdfaf5', minWidth: '1100px' }}>
            
            {isLoading && <div className="loading-state">Consolidando Reporte Maestro...</div>}

            {/* BLOQUE 1: Quedará en las primeras páginas */}
            <div id="pdf-parte-1" ref={parte1Ref} style={{ display: isLoading ? 'none' : 'block' }}>
                <header className="perfil-header" style={{ borderBottom: '4px solid var(--dark-brown)', paddingBottom: '20px', marginBottom: '30px' }}>
                    <div>
                        <h1>Reporte <span>Maestro Integral</span></h1>
                        <p>Análisis consolidado del programa de monitoreo apícola.</p>
                    </div>
                    <button onClick={generarPDF} className="perfil-btn" disabled={isGenerating} data-html2canvas-ignore>
                        {isGenerating ? 'Generando PDF...' : 'Descargar Reporte'}
                    </button>
                </header>

                <section className="report-section">
                    <h2 className="filter-label">1. Resumen de Negocio y ROI</h2>
                    <div className="stats-grid-dashboard">
                        <div className="stat-card highlight">
                            <label>ROI</label>
                            <h2 style={{ fontSize: '3.5rem' }}>{globalStats?.roi.porcentaje}%</h2>
                            <div className="roi-badge">Neto: {formatMoneda(globalStats?.roi.beneficio)}</div>
                            <p style={{ fontSize: '0.9rem', marginTop: '10px', color: 'var(--dark-brown)' }}>
                                Ingresos: {formatMoneda(globalStats?.roi.ingresos)} vs Egresos: {formatMoneda(globalStats?.roi.egresos)}
                            </p>
                        </div>

                        <div className="stat-card">
                            <label>Producción vs Alimentación</label>
                            <div className="production-split-container">
                                <div className="prod-box honey"><span className="prod-value">{globalStats?.produccionTotal.miel}</span><span className="prod-label">Kg Miel</span></div>
                                <div className="prod-box pollen"><span className="prod-value">{globalStats?.produccionTotal.polen}</span><span className="prod-label">Kg Polen</span></div>
                            </div>
                            <div className="production-split-container" style={{ marginTop: '10px' }}>
                                <div className="prod-box liquid"><span className="prod-value">{globalStats?.gastoTotal.liquido}</span><span className="prod-label">Jarabe (L)</span></div>
                                <div className="prod-box solid"><span className="prod-value">{globalStats?.gastoTotal.solido}</span><span className="prod-label">Torta (Kg)</span></div>
                            </div>
                        </div>

                        <div className="stat-card wide-card">
                            <label>Tendencia Global</label>
                            <Chart
                                chartType="LineChart"
                                width="100%" height="250px"
                                data={[
                                    ["Mes", "Miel", "Polen", "Líquido", "Sólido"],
                                    ...globalStats.comparativaMeses.map(m => [
                                        formatearEtiquetaX(m.mes), 
                                        Number(m.miel), Number(m.polen), Number(m.liquido), Number(m.solido) || 0
                                    ])
                                ]}
                                options={{
                                    curveType: "function",
                                    colors: ["#f59e0b", "#10b981", "#3b82f6", "#ef4444"],
                                    chartArea: { width: '85%', height: '70%' },
                                    hAxis: { type: 'string', textStyle: { fontSize: 9 } }
                                }}
                            />
                        </div>
                    </div>
                </section>

                <section className="report-section" style={{ marginTop: '40px' }}>
                    <h2 className="filter-label">2. Comportamiento por Apiario</h2>
                    <div className="charts-grid">
                        {apiarioStats?.apiariosResumen.map(api => (
                            <div key={api.nombre} className="chart-card">
                                <h4 style={{ color: 'var(--dark-brown)', marginBottom: '10px', textAlign: 'center' }}>Apiario {limpiarNombre(api.nombre)}</h4>
                                <Chart
                                    chartType="AreaChart"
                                    width="100%" height="180px"
                                    data={[
                                        ["Mes", "Miel", "Polen"], 
                                        ...api.historico.map(h => [formatearEtiquetaX(h.mes), Number(h.miel), Number(h.polen)])
                                    ]}
                                    options={{
                                        colors: ["#f59e0b", "#10b981"],
                                        chartArea: { width: '80%', height: '70%' },
                                        legend: 'none',
                                        hAxis: { type: 'string', textStyle: { fontSize: 8 }, showTextEvery: 3 }
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* BLOQUE 2: Forzado a una página nueva en el PDF */}
            <div id="pdf-parte-2" ref={parte2Ref} style={{ display: isLoading ? 'none' : 'block' }}>
                <section className="report-section" style={{ marginTop: '20px' }}>
                    <h2 className="filter-label">3. Eficiencia y Factores Geográficos</h2>
                    <div className="stats-grid-dashboard">
                        <div className="stat-card">
                            <label>Eficiencia (Kg/Colmena)</label>
                            <Chart
                                chartType="BarChart"
                                width="100%" height="300px"
                                data={[
                                    ["Apiario", "Eficiencia"],
                                    ...eficienciaStats?.apiariosEficiencia.map(a => [limpiarNombre(a.nombre), a.historico[a.historico.length - 1]?.eficiencia || 0])
                                ]}
                                options={{ 
                                    colors: ["#8b5cf6"], 
                                    chartArea: { width: '50%', left: '25%' },
                                    vAxis: { textStyle: { fontSize: 11, bold: true } }
                                }}
                            />
                        </div>
                        <div className="stat-card wide-card">
                            <label>Rendimiento por Altitud (msnm)</label>
                            <Chart
                                chartType="ColumnChart"
                                width="100%" height="300px"
                                data={[
                                    ["Altitud", "Miel", "Polen"],
                                    ...(alturaStats?.dataAltura.map(d => [d.rango, d.miel, d.polen]) || [])
                                ]}
                                options={{ 
                                    colors: ["#f59e0b", "#10b981"], 
                                    chartArea: { width: '85%', height: '60%', bottom: '25%' },
                                    hAxis: { slantedText: true, slantedTextAngle: 45 }
                                }}
                            />
                        </div>
                    </div>
                </section>

                <section className="elite-ranking-container" style={{ marginTop: '40px', border: '3px solid var(--dark-brown)' }}>
                    <h3 style={{ padding: '15px', backgroundColor: 'var(--yellow-honey)' }}>🏆 Ranking de Colmenas Élite</h3>
                    <table className="neobrutalist-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Colmena</th>
                                <th>Apiario</th>
                                <th>Producción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {globalStats?.rankingElite.map((hive, idx) => (
                                <tr key={hive.id_colmena}>
                                    <td>{idx + 1}</td>
                                    <td>{hive.id_colmena}</td>
                                    <td>{limpiarNombre(hive.apiario)}</td>
                                    <td style={{ fontWeight: 'bold' }}>{hive.produccion} Kg</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
};

export default ReporteCompleto;