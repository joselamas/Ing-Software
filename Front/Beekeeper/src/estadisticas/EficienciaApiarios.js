import React, { useState, useMemo, useEffect } from 'react';
import { Chart } from "react-google-charts";
import { useEficienciaApiarios } from './hooks/useEficienciaApiarios';
import './css/eficienciaApiarios.css';

const EficienciaApiarios = ({ usr }) => {
    const { stats, loading } = useEficienciaApiarios(usr);
    const [selectedApiarios, setSelectedApiarios] = useState([]);

    // Paleta de colores dinámica para soportar cualquier cantidad de apiarios
    const APIARIO_COLORS = [
        "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", 
        "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"
    ]; 

    // 1. Sincronizamos la selección inicial de forma segura
    useEffect(() => {
        if (stats?.apiariosEficiencia?.length > 0) {
            setSelectedApiarios(stats.apiariosEficiencia.map(a => a.nombre));
        }
    }, [stats]);

    const handleToggle = (nombre) => {
        setSelectedApiarios(prev => 
            prev.includes(nombre) ? prev.filter(n => n !== nombre) : [...prev, nombre]
        );
    };

    // 2. Transformación de datos con protección total
    const { mielData, polenData } = useMemo(() => {
        if (!stats?.apiariosEficiencia?.length || selectedApiarios.length === 0) {
            return { mielData: null, polenData: null };
        }

        const filtrados = stats.apiariosEficiencia.filter(a => selectedApiarios.includes(a.nombre));
        
        // Extraemos todas las etiquetas de meses únicas de todos los apiarios y las ordenamos
        const etiquetasMeses = Array.from(new Set(
            stats.apiariosEficiencia.flatMap(api => api.historico.map(h => h.mes))
        )).sort();
        
        const header = ["Mes", ...filtrados.map(a => a.nombre)];
        
        const mielRows = etiquetasMeses.map((mes) => {
            const fila = [mes];
            filtrados.forEach(apiario => {
                // Buscamos el registro específico para este mes en el apiario para alinear los puntos
                const punto = apiario.historico.find(h => h.mes === mes);
                fila.push(punto ? Number(punto.eficiencia) : 0);
            });
            return fila;
        });

        const polenRows = etiquetasMeses.map((mes) => {
            const fila = [mes];
            filtrados.forEach(apiario => {
                // Buscamos el registro específico para este mes en el apiario para alinear los puntos
                const punto = apiario.historico.find(h => h.mes === mes);
                fila.push(punto ? Number(punto.polen) : 0);
            });
            return fila;
        });

        return { 
            mielData: [header, ...mielRows], 
            polenData: [header, ...polenRows]
        };
    }, [stats, selectedApiarios]);

    // Calculamos los colores activos para mantener la correspondencia Apiario -> Color
    const activeColors = useMemo(() => {
        if (!stats?.apiariosEficiencia) return [];
        return stats.apiariosEficiencia
            .map((a, i) => selectedApiarios.includes(a.nombre) ? APIARIO_COLORS[i % APIARIO_COLORS.length] : null)
            .filter(c => c !== null);
    }, [selectedApiarios, stats]);

    // 3. Generador de opciones para mantener coherencia visual
    const getChartOptions = (tituloY) => ({
        curveType: "function",
        pointSize: 6,
        lineWidth: 3,
        legend: { position: "none" },
        colors: activeColors.length > 0 ? activeColors : ["#f59e0b"],
        hAxis: {
            textStyle: { fontSize: 10 },
            showTextEvery: 2,
            gridlines: { color: 'transparent' }
        },
        vAxis: {
            minValue: 0,
            title: tituloY,
            gridlines: { color: '#f3f4f6' }
        },
        chartArea: { width: "85%", height: "70%" },
    });

    if (loading) {
        return <div className="loading-state">Sincronizando rendimiento de apiarios...</div>;
    }

    return (
        <div className="gestion-container">
            <header className="perfil-header">
                <h1>Eficiencia por <span>Apiario</span></h1>
                <p>Producción promedio de miel por colmena activa (Kg/Colmena).</p>
            </header>
            
            <div className="apiario-check-group animate-fade-in">
                <span className="filter-label">Mostrar Apiarios:</span>
                {stats?.apiariosEficiencia?.map((api, i) => (
                    <label key={api.nombre} className="apiario-check-item">
                        <input 
                            type="checkbox" 
                            className="hidden"
                            checked={selectedApiarios.includes(api.nombre)}
                            onChange={() => handleToggle(api.nombre)}
                        />
                        <div 
                            className={`custom-checkbox ${selectedApiarios.includes(api.nombre) ? 'active' : ''}`}
                            style={{ 
                                backgroundColor: selectedApiarios.includes(api.nombre) ? APIARIO_COLORS[i % APIARIO_COLORS.length] : 'transparent',
                                borderColor: APIARIO_COLORS[i % APIARIO_COLORS.length] 
                            }}
                        >
                            {selectedApiarios.includes(api.nombre) && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 20 20" fill="white">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <span className={`text-sm font-medium ${selectedApiarios.includes(api.nombre) ? 'text-gray-800' : 'text-gray-400'}`}>
                            {api.nombre}
                        </span>
                    </label>
                ))}
            </div>

            <div className="eficiencia-chart-card">
                {mielData && mielData.length > 1 ? (
                <Chart
                    chartType="LineChart"
                    width="100%"
                    height="350px"
                    data={mielData}
                    options={getChartOptions("Kg Miel / Colmena")}
                    loader={<div style={{padding: '20px', textAlign: 'center'}}>Generando comparativa...</div>}
                /> ) : (
                    <div className="no-data-msg" style={{textAlign: 'center', padding: '40px'}}>
                        Selecciona al menos un apiario para visualizar los datos de eficiencia.
                    </div>
                )}
            </div>

            <div className="eficiencia-chart-card" style={{ marginTop: '30px' }}>
                {polenData && polenData.length > 1 ? (
                <Chart
                    chartType="LineChart"
                    width="100%"
                    height="350px"
                    data={polenData}
                    options={getChartOptions("Kg Polen / Colmena")}
                    loader={<div style={{padding: '20px', textAlign: 'center'}}>Analizando polen...</div>}
                /> ) : (
                    <div className="no-data-msg" style={{textAlign: 'center', padding: '40px'}}>
                        Selecciona apiarios para ver la eficiencia de polen.
                    </div>
                )}
            </div>

            <div className="eficiencia-info-box">
                <strong>Nota de análisis:</strong> La eficiencia se calcula promediando la cosecha total del apiario sobre el total de colmenas activas en ese periodo. 
                Valores superiores a 15 Kg/Colmena indican una floración óptima o manejo élite.
            </div>

            <div className="eficiencia-info-box" style={{ marginTop: '10px' }}>
                <strong>Capacidad de carga:</strong> Más de 40 Kg por colmena implica que el apiario tiene capacidad de expansión o agregar más colmenas. 
                La capacidad de carga máxima o saturación de abejas no ha llegado a su punto óptimo en este ecosistema.
            </div>
        </div>
    );
};

export default EficienciaApiarios;