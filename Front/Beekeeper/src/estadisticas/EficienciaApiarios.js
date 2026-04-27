import React, { useState, useMemo, useEffect } from 'react';
import { Chart } from "react-google-charts";
import { useEficienciaApiarios } from './hooks/useEficienciaApiarios';
import './css/eficienciaApiarios.css';

const EficienciaApiarios = ({ usr }) => {
    const { stats, loading, getColorByIndex } = useEficienciaApiarios(usr);
    const [selectedApiarios, setSelectedApiarios] = useState([]);

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
    const { mielData, polenData, colors: activeColors } = useMemo(() => {
        if (!stats?.apiariosEficiencia || stats.apiariosEficiencia.length === 0 || selectedApiarios.length === 0) {
            return { mielData: null, polenData: null, colors: [] };
        }

        const filtrados = stats.apiariosEficiencia.filter(a => selectedApiarios.includes(a.nombre));
        
        // SACAR MESES DE FORMA SEGURA: Usamos el primer apiario del filtro
        const primerApiario = filtrados[0];
        const etiquetasMeses = primerApiario?.historico?.map(h => h.mes) || [];
        
        const header = ["Mes", ...filtrados.map(a => a.nombre)];
        
        const mielRows = etiquetasMeses.map((mes, idx) => {
            const fila = [mes];
            filtrados.forEach(apiario => {
                const punto = apiario.historico[idx];
                fila.push(punto ? Number(punto.eficiencia) : 0);
            });
            return fila;
        });

        const polenRows = etiquetasMeses.map((mes, idx) => {
            const fila = [mes];
            filtrados.forEach(apiario => {
                const punto = apiario.historico[idx];
                fila.push(punto ? Number(punto.polen) : 0);
            });
            return fila;
        });

        return { 
            mielData: [header, ...mielRows], 
            polenData: [header, ...polenRows],
            colors: filtrados.map(a => getColorByIndex(a.id)) 
        };
    }, [stats, selectedApiarios, getColorByIndex]);

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
        <div className="gestion-container eficiencia-container">
            <header className="perfil-header">
                <h1>Eficiencia por <span>Apiario</span></h1>
                <p>Producción promedio de miel por colmena activa (Kg/Colmena).</p>
            </header>
            
            <div className="check-group-grid">
                {stats?.apiariosEficiencia?.map((api) => (
                    <label key={api.id} className="eficiencia-check-item">
                        <input 
                            type="checkbox" 
                            className="hidden"
                            checked={selectedApiarios.includes(api.nombre)}
                            onChange={() => handleToggle(api.nombre)}
                        />
                        <div 
                            className="custom-box"
                            style={{ 
                                backgroundColor: selectedApiarios.includes(api.nombre) ? getColorByIndex(api.id) : 'white',
                                borderColor: getColorByIndex(api.id)
                            }}
                        >
                            {selectedApiarios.includes(api.nombre) && "✓"}
                        </div>
                        <span>{api.nombre}</span>
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