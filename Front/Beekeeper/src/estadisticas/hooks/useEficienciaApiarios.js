import { useState, useEffect, useCallback } from 'react';

export const useEficienciaApiarios = (usr) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    const getColorByIndex = useCallback((id) => {
        const colors = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444"];
        return colors[id % colors.length];
    }, []);

    useEffect(() => {
        const generarDatos = () => {
            const apiariosNombres = ["Pedregosa", "Mesa de los Indios", "La Montaña", "El Mirador"];
            const colmenasPorApiario = [12, 25, 15, 8];
            const mesesLabel = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
            
            const hoy = new Date();
            const historialFechas = Array.from({ length: 12 }, (_, i) => 
                new Date(hoy.getFullYear(), hoy.getMonth() - (11 - i), 1)
            );

            const apiariosEficiencia = apiariosNombres.map((nombre, index) => {
                const colmenasActivas = colmenasPorApiario[index];
                
                const historico = historialFechas.map(fecha => {
                    const mesIdx = fecha.getMonth();
                    const esTemporadaMiel = [3, 4, 10, 11].includes(mesIdx);
                    const esTemporadaPolen = [2, 3, 4, 8, 9].includes(mesIdx);
                    
                    const mielTotalMes = esTemporadaMiel ? Math.floor(Math.random() * 180) + 40 : 2;
                    const polenTotalMes = esTemporadaPolen ? Math.floor(Math.random() * 40) + 10 : 1;
                    
                    return {
                        mes: `${mesesLabel[mesIdx]} ${String(fecha.getFullYear()).slice(-2)}`,
                        eficiencia: Number((mielTotalMes / colmenasActivas).toFixed(2)),
                        polen: Number((polenTotalMes / colmenasActivas).toFixed(2))
                    };
                });

                return { id: index, nombre, colmenasActivas, historico };
            });

            setStats({ apiariosEficiencia });
            setLoading(false);
        };

        const timer = setTimeout(generarDatos, 600);
        return () => clearTimeout(timer);
    }, [usr]);

    return { stats, loading, getColorByIndex };
};