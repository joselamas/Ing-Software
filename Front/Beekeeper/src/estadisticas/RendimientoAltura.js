import React, { useMemo, useState, useRef } from 'react';
import { Chart } from "react-google-charts";
import { useRendimientoAltura } from './hooks/useRendimientoAltura';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './css/rendimientoAltura.css';

const RendimientoAltura = ({ usr }) => {
    const { stats, loading } = useRendimientoAltura(usr);
    const reportRef = useRef();
    const [isExporting, setIsExporting] = useState(false);

    const chartData = useMemo(() => {
        if (!stats?.dataAltura) return null;

        const header = ["Rango Altura", "Miel (Kg)", "Polen (Kg)"];
        const rows = stats.dataAltura.map(d => [d.rango, d.miel, d.polen]);
        
        return [header, ...rows];
    }, [stats]);

    const chartOptions = {
        curveType: "function",
        pointSize: 6,
        lineWidth: 3,
        chartArea: { width: "85%", height: "70%" },
        colors: ["#f59e0b", "#10b981"], // Ámbar para Miel, Esmeralda para Polen
        hAxis: {
            title: "Altitud (msnm)",
            textStyle: { fontSize: 10 },
        },
        vAxis: {
            title: "Producción Promedio (Kg)",
            minValue: 0,
            gridlines: { color: '#f3f4f6' }
        },
        legend: { position: "top", textStyle: { fontSize: 12, fontWeight: 'bold' } },
    };

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
                onclone: (clonedDoc) => {
                    const styleTag = clonedDoc.createElement('style');
                    styleTag.innerHTML = `
                        .gestion-container::before { display: none !important; }
                        .gestion-container { background: #fdfaf5 !important; background-image: none !important; }
                    `;
                    clonedDoc.head.appendChild(styleTag);

                    clonedDoc.querySelectorAll('*').forEach(el => {
                        const style = window.getComputedStyle(el);
                        ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'].forEach(prop => {
                            const value = style[prop];
                            if (value && value.includes('color(')) {
                                el.style[prop] = (prop === 'backgroundColor' || prop === 'fill') ? 'transparent' : '#2e1a12';
                            }
                        });
                    });
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

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Rendimiento_Altura_${usr?.acronimo || 'Beekeeper'}.pdf`);
        } catch (error) {
            console.error("Error al generar PDF:", error);
        }
        window.scrollTo(scrollX, scrollY);
        setIsExporting(false);
    };

    if (loading) {
        return <div className="loading-state">Sincronizando datos geográficos...</div>;
    }

    return (
        <div className="gestion-container" ref={reportRef}>
            <header className="perfil-header">
                <div>
                    <h1>Rendimiento por <span>Altitud</span></h1>
                    <p>Análisis de eficiencia basado en la ubicación geográfica de las colmenas.</p>
                </div>
                <button 
                    onClick={handleDownloadPDF} 
                    className="page-btn" 
                    style={{ alignSelf: 'center' }}
                    disabled={isExporting}
                    data-html2canvas-ignore
                >
                    {isExporting ? 'Generando...' : 'Descargar PDF'}
                </button>
            </header>

            <div className="stats-grid-dashboard">
                <div className="stat-card wide-card animate-fade-in">
                    <label>Comparativa Miel vs Polen por Piso Térmico</label>
                    <div className="altura-chart-wrapper">
                        {chartData ? (
                            <Chart
                                chartType="LineChart"
                                width="100%"
                                height="400px"
                                data={chartData}
                                options={chartOptions}
                                loader={<div className="loading-chart">Generando comparativa...</div>}
                            />
                        ) : (
                            <div className="no-data-msg">No hay datos históricos para este análisis.</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="altura-info-box">
                <strong>Interpretación:</strong> La altitud (msnm) define el piso térmico. En este análisis, dividimos las colmenas en grupos de 500m para identificar qué alturas favorecen la producción de miel vs polen.
            </div>

            <div className="altura-info-box" style={{ marginTop: '10px' }}>
                <strong>Sugerencia técnica:</strong> Si observas rendimientos bajos en alturas superiores a 2500m, considera suplementación adicional debido a la menor biodiversidad en climas fríos.
            </div>
        </div>
    );
};

export default RendimientoAltura;