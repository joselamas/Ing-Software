import React, { useMemo } from 'react';
import { Chart } from "react-google-charts";
import { useRendimientoAltura } from './hooks/useRendimientoAltura';
import './css/rendimientoAltura.css';

const RendimientoAltura = ({ usr }) => {
    const { stats, loading } = useRendimientoAltura(usr);

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

    if (loading) {
        return <div className="loading-state">Sincronizando datos geográficos...</div>;
    }

    return (
        <div className="gestion-container">
            <header className="perfil-header">
                <h1>Rendimiento por <span>Altitud</span></h1>
                <p>Análisis de eficiencia basado en la ubicación geográfica de las colmenas.</p>
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