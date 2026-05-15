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

    const { stats: globalStats, annualStats, loading: load1, formatMoneda } = useEstadisticas(usr);
    const { stats: apiarioStats, loading: load2 } = useAnalisisApiarios(usr);
    const { stats: eficienciaStats, loading: load3 } = useEficienciaApiarios(usr);
    const { stats: alturaStats, loading: load4 } = useRendimientoAltura(usr);

    const isLoading = load1 || load2 || load3 || load4;

    const renderValor = (valor, decimales = 2) => {
        if (typeof valor === 'number') {
            return valor % 1 === 0 ? valor.toLocaleString() : valor.toFixed(decimales);
        }
        return valor || '0';
    };

    const formatearEtiquetaX = (valor) => {
        if (!valor) return "";
        const str = valor.toString().trim();
        if (str.includes('-')) {
            const partes = str.split('-');
            return `${partes[0].slice(-2)}-${partes[1]}`;
        }
        return str.length >= 4 ? str.slice(-2) : str;
    };

    const limpiarNombre = (nombre) => (nombre ? nombre.toString().trim() : "");

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
                    
                    ['pdf-parte-1', 'pdf-parte-2'].forEach(id => {
                        const bloque = clonedDoc.getElementById(id);
                        if (bloque) {
                            bloque.style.backgroundColor = '#ffffff';
                            bloque.style.padding = '30px'; 
                        }
                    });

                    const btns = clonedDoc.querySelectorAll('.perfil-btn');
                    btns.forEach(b => b.style.display = 'none');
                }
            };

            const agregarBloqueAlPDF = async (element, esPrimerBloque) => {
                if (!element) {
                    throw new Error("Elemento de reporte no encontrado en el DOM");
                }
                const canvas = await html2canvas(element, opcionesCanvas);
                const imgData = canvas.toDataURL('image/png');
                const imgHeight = (canvas.height * pdfWidth) / canvas.width;
                
                let heightLeft = imgHeight;
                let position = 0;

                if (!esPrimerBloque) {
                    pdf.addPage();
                }

                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft > 0) {
                    position -= pageHeight; 
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
            };

            await agregarBloqueAlPDF(parte1Ref.current, true);
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

    useEffect(() => {
        if (onDownloadTriggered && !isLoading && !isGenerating) {
            const timer = setTimeout(() => {
                generarPDF()
                .catch(err => console.error("Fallo en descarga automática:", err))
                .finally(() => {
                    if (onDownloadComplete) onDownloadComplete();
                });
            }, 1500); 

            return () => clearTimeout(timer);
        }
    }, [onDownloadTriggered, isLoading, isGenerating, onDownloadComplete, generarPDF]);

    return (
        <div className="gestion-container" ref={reportRef} style={{ padding: '40px', backgroundColor: '#fdfaf5', minWidth: '1100px' }}>
            
            {isLoading && <div className="loading-state">Consolidando Reporte Maestro...</div>}

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
                    <h2 className="filter-label">1. Resumen de Consumo vs Producción</h2>
                    <div className="stats-grid-dashboard">
                        <div className="stat-card highlight">
                            <label>Consumo vs Producción</label>
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
                                    hAxis: { type: 'string', textStyle: { fontSize: 9 } },
                                    legend: { position: 'top', textStyle: { fontSize: 10, bold: true } }
                                }}
                            />
                        </div>
                    </div>
                </section>

                <section className="report-section" style={{ marginTop: '40px' }}>
                    <h2 className="filter-label">1.1 Desglose de Rendimiento por Temporada</h2>
                    <div className="produccion-container">
                        {annualStats.map((data) => (
                            <div key={data.anio} className="anio-stats-block" style={{ marginBottom: '30px', padding: '20px', border: '3px solid var(--dark-brown)', borderRadius: '12px', backgroundColor: '#fff' }}>
                                <h3 className="anio-title" style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--dark-brown)', borderBottom: '2px solid var(--primary-yellow)', paddingBottom: '10px', marginBottom: '20px' }}>Resumen Anual {data.anio}</h3>
                                <div className="stats-grid-small" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="stat-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '15px', backgroundColor: '#fdfaf5', border: '1px solid var(--soft-border)', borderRadius: '14px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Miel (Kg)</span><strong>{renderValor(data.mielKg)}</strong></div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Jarabe (Kg)</span><strong>{renderValor(data.jarabeKg)}</strong></div>
                                        <div style={{ gridColumn: 'span 2', backgroundColor: 'var(--primary-yellow)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', display: 'block' }}>Relación Neta Miel</span>
                                            <strong>{renderValor(data.relacionNetaMiel)}</strong>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Miel ($)</span><strong>${renderValor(data.mielValor)}</strong></div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Jarabe ($)</span><strong>${renderValor(data.jarabeValor)}</strong></div>
                                        <div style={{ gridColumn: 'span 2', backgroundColor: 'var(--primary-yellow)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', display: 'block' }}>Relación Econ. Miel</span>
                                            <strong>{renderValor(data.relacionEconomicaMiel)}</strong>
                                        </div>
                                    </div>
                                    <div className="stat-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '15px', backgroundColor: '#fdfaf5', border: '1px solid var(--soft-border)', borderRadius: '14px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Polen (Kg)</span><strong>{renderValor(data.polenKg)}</strong></div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Torta (Kg)</span><strong>{renderValor(data.tortaKg)}</strong></div>
                                        <div style={{ gridColumn: 'span 2', backgroundColor: 'var(--primary-yellow)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', display: 'block' }}>Relación Neta Polen</span>
                                            <strong>{renderValor(data.relacionNetaPolen)}</strong>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Polen ($)</span><strong>${renderValor(data.polenValor)}</strong></div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Torta ($)</span><strong>${renderValor(data.tortaValor)}</strong></div>
                                        <div style={{ gridColumn: 'span 2', backgroundColor: 'var(--primary-yellow)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', display: 'block' }}>Relación Econ. Polen</span>
                                            <strong>{renderValor(data.relacionEconomicaPolen)}</strong>
                                        </div>
                                    </div>
                                    <div style={{ gridColumn: 'span 2', backgroundColor: 'var(--primary-yellow)', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '2px solid var(--dark-brown)', marginTop: '10px' }}>
                                        <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Resultado Económico Final {data.anio}</span>
                                        <strong style={{ display: 'block', fontSize: '1.5rem', marginTop: '5px' }}>${renderValor(data.mielValor + data.polenValor - data.jarabeValor - data.tortaValor)}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="report-section" style={{ marginTop: '40px' }}>
                    <h2 className="filter-label">2. Comportamiento por Apiario</h2>
                    <p style={{ fontSize: '1rem', color: 'var(--dark-brown)', marginBottom: '15px', fontWeight: '700' }}>
                        Balance de producción mensual: <span style={{ color: '#b45309' }}>● Miel (Ámbar)</span> y <span style={{ color: '#065f46' }}>● Polen (Verde)</span>.
                    </p>
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
                                        legend: { position: 'bottom', textStyle: { fontSize: 9, bold: true } },
                                        hAxis: { type: 'string', textStyle: { fontSize: 8 }, showTextEvery: 3 }
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div id="pdf-parte-2" ref={parte2Ref} style={{ display: isLoading ? 'none' : 'block' }}>
                <section className="report-section" style={{ marginTop: '20px' }}>
                    <h2 className="filter-label">3. Eficiencia por Apiario</h2>
                    <div className="stats-grid-dashboard">
                        <div className="stat-card wide-card">
                            <label>Promedio de producción (Kg/Colmena)</label>
                            <Chart
                                chartType="BarChart"
                                width="100%" 
                                height="600px" 
                                data={[
                                    ["Apiario", "Producción (Kg/Colm)", { role: "annotation" }],
                                    ...(eficienciaStats?.apiariosEficiencia.map(a => {
                                        const nombre = limpiarNombre(a.nombre);
                                        const valor = a.historico[a.historico.length - 1]?.eficiencia || 0;
                                        return [nombre, valor, nombre];
                                    }) || [])
                                ]}
                                options={{ 
                                    colors: ["#8b5cf6"],
                                    chartArea: { 
                                        width: '75%', 
                                        left: '5%', 
                                        height: '85%',
                                        top: '5%'
                                    },
                                    annotations: {
                                        alwaysOutside: false,
                                        textStyle: {
                                            fontSize: 14,
                                            bold: true,
                                            color: '#ffffff',
                                            auraColor: 'none'
                                        }
                                    },
                                    vAxis: { 
                                        textPosition: 'none' 
                                    },
                                    hAxis: {
                                        title: "Kg por Colmena",
                                        minValue: 0,
                                        gridlines: { color: '#f3f4f6' }
                                    },
                                    bar: { groupWidth: "75%" },
                                    legend: { position: 'none' }
                                }}
                            />
                        </div>
                    </div>
                </section>

                <section className="report-section" style={{ marginTop: '40px' }}>
                    <h2 className="filter-label">4. Factores Geográficos (Altitud)</h2>
                    <div className="stats-grid-dashboard">
                        <div className="stat-card wide-card">
                            <label>Rendimiento Comparativo por Altitud (msnm)</label>
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
                                    hAxis: { slantedText: true, slantedTextAngle: 45 },
                                    legend: { position: 'top', textStyle: { fontSize: 10 } }
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