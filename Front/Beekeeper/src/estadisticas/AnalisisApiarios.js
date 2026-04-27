import React, { useMemo, useState, useEffect } from 'react';
import { Chart } from "react-google-charts";
import { useAnalisisApiarios } from './hooks/useAnalisisApiarios';
import './css/analisisApiarios.css';

const AnalisisApiarios = ({ usr }) => {
    const { stats, loading } = useAnalisisApiarios(usr);

    // Colores fijos por apiario (Pedregosa, Mesa, Montaña, Mirador)
    const APIARIO_COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6"]; 

    // Estado para los apiarios seleccionados
    const [selectedNames, setSelectedNames] = useState([]);

    // Inicializar todos los apiarios como seleccionados cuando cargan los datos
    useEffect(() => {
        if (stats?.apiariosResumen) {
            setSelectedNames(stats.apiariosResumen.map(a => a.nombre));
        }
    }, [stats]);

    const toggleApiario = (nombre) => {
        setSelectedNames(prev => 
            prev.includes(nombre) 
                ? prev.filter(n => n !== nombre) 
                : [...prev, nombre]
        );
    };

    // Función ultra-segura para transformar datos
    const prepararDatos = (key) => {
        if (!stats?.apiariosResumen?.length || selectedNames.length === 0) {
            return [["Mes", "Sin Datos"], ["-", 0]];
        }

        // Filtramos solo los apiarios que están en el estado de seleccionados
        const apiariosFiltrados = stats.apiariosResumen.filter(a => selectedNames.includes(a.nombre));
        const etiquetasMeses = stats.apiariosResumen[0].historico.map(h => h.mes);
        const header = ["Mes", ...apiariosFiltrados.map(a => a.nombre)];
        const rows = etiquetasMeses.map((mes, idx) => {
            const fila = [mes];
            apiariosFiltrados.forEach(apiario => {
                const valor = apiario.historico[idx] ? apiario.historico[idx][key] : 0;
                fila.push(Number(valor));
            });
            return fila;
        });

        return [header, ...rows];
    };

    const mielData = useMemo(() => prepararDatos('miel'), [stats, selectedNames]);
    const polenData = useMemo(() => prepararDatos('polen'), [stats, selectedNames]);
    const liquidoData = useMemo(() => prepararDatos('liquido'), [stats, selectedNames]);
    const solidoData = useMemo(() => prepararDatos('solido'), [stats, selectedNames]);

    // Calculamos los colores activos para mantener la correspondencia Apiario -> Color
    const activeColors = useMemo(() => {
        if (!stats?.apiariosResumen) return APIARIO_COLORS;
        return stats.apiariosResumen
            .map((a, i) => selectedNames.includes(a.nombre) ? APIARIO_COLORS[i] : null)
            .filter(c => c !== null);
    }, [selectedNames, stats]);

    const opcionesBasicas = (titulo) => ({
        title: titulo,
        curveType: "function",
        legend: { position: "none" }, // Eliminamos la leyenda de la gráfica
        hAxis: { textStyle: { fontSize: 10 }, showTextEvery: 2 },
        vAxis: { minValue: 0 },
        chartArea: { width: "85%", height: "70%" },
        colors: activeColors
    });

    if (loading) return <div className="loading-state">Sincronizando análisis de producción...</div>;

    return (
        <div className="gestion-container">
            <header className="perfil-header">
                <h1>Monitoreo de <span>Apiarios</span></h1>
                <p>Seguimiento detallado de producción y suministro de alimento por zona.</p>
            </header>
            
            {/* Panel de Filtros (Check Group) */}
            <div className="apiario-check-group animate-fade-in">
                <span className="filter-label">Mostrar Apiarios:</span>
                {stats?.apiariosResumen.map((api, i) => (
                    <label key={api.nombre} className="apiario-check-item">
                        <input 
                            type="checkbox" 
                            className="hidden"
                            checked={selectedNames.includes(api.nombre)}
                            onChange={() => toggleApiario(api.nombre)}
                        />
                        <div 
                            className={`custom-checkbox ${selectedNames.includes(api.nombre) ? 'active' : ''}`}
                        style={{ 
                            backgroundColor: selectedNames.includes(api.nombre) ? APIARIO_COLORS[i] : 'transparent',
                            borderColor: APIARIO_COLORS[i] 
                        }}>
                            {selectedNames.includes(api.nombre) && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 20 20" fill="white">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <span className={`text-sm font-medium ${selectedNames.includes(api.nombre) ? 'text-gray-800' : 'text-gray-400'}`}>
                            {api.nombre}
                        </span>
                    </label>
                ))}
            </div>
            
            <div className="charts-grid">
                {/* 1. Miel - Comparativa Global */}
                <div className="chart-card animate-fade-in">
                    <Chart
                        chartType="LineChart"
                        width="100%" height="300px"
                        data={mielData}
                        options={opcionesBasicas("Cosecha de Miel (Kg)")}
                    />
                </div>

                {/* 2. Polen - Por Apiario */}
                <div className="chart-card animate-fade-in">
                    <Chart
                        chartType="LineChart"
                        width="100%" height="300px"
                        data={polenData}
                        options={opcionesBasicas("Cosecha de Polen (Kg)")}
                    />
                </div>

                {/* 3. Alimentación Líquida */}
                <div className="chart-card animate-fade-in">
                    <Chart
                        chartType="LineChart"
                        width="100%" height="300px"
                        data={liquidoData}
                        options={opcionesBasicas("Jarabe de Azúcar (Litros)")}
                    />
                </div>

                {/* 4. Alimentación Sólida */}
                <div className="chart-card animate-fade-in">
                    <Chart
                        chartType="LineChart"
                        width="100%" height="300px"
                        data={solidoData}
                        options={opcionesBasicas("Torta Proteica (Kg)")}
                    />
                </div>
            </div>
        </div>
    );
};

export default AnalisisApiarios;