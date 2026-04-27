import { useState, useEffect } from 'react';

export const useAnalisisApiarios = (usr) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const generarDatos = () => {
            const nombresApiarios = ["Pedregosa", "Mesa de los Indios", "La Montaña", "El Mirador"];
            const mesesLabel = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
            const hoy = new Date();
            
            // Generamos los últimos 18 meses
            const historialFechas = [];
            for (let i = 17; i >= 0; i--) {
                historialFechas.push(new Date(hoy.getFullYear(), hoy.getMonth() - i, 1));
            }

            const apiariosResumen = nombresApiarios.map((nombre, index) => {
                const historico = historialFechas.map(fecha => {
                    const mesIdx = fecha.getMonth();
                    const esTemporadaMiel = [3, 4, 10, 11].includes(mesIdx); // Abril, Mayo, Nov, Dic
                    const esTemporadaPolen = [2, 3, 4, 8, 9].includes(mesIdx);

                    const miel = esTemporadaMiel ? Math.floor(Math.random() * 30) + 10 : 0;
                    const polen = esTemporadaPolen ? Math.floor(Math.random() * 8) + 2 : 0;
                    
                    // REGLA: Si hay cosecha de miel, NO se alimenta con azúcar (líquido)
                    const liquido = miel > 0 ? 0 : Math.floor(Math.random() * 10) + 5;
                    
                    // REGLA: Si hay polen, se da un poco de torta (sólido), si no hay nada se da más.
                    // Añadimos una variación (index * 0.3) para que las líneas no se solapen en la gráfica.
                    const solido = polen > 0 ? (0.5 + (index * 0.2)) : (miel === 0 ? (2.5 + (index * 0.3)) : 0);

                    return {
                        mes: `${mesesLabel[mesIdx]} ${String(fecha.getFullYear()).slice(-2)}`,
                        miel,
                        polen,
                        liquido,
                        solido
                    };
                });

                return {
                    id: index,
                    nombre,
                    msnm: 1000 + (index * 400),
                    historico
                };
            });

            setStats({
                apiariosResumen,
                analisisAltitud: [
                    { rango: "Bajo", eficiencia: 70, color: "#f87171" },
                    { rango: "Medio", eficiencia: 90, color: "#fbbf24" },
                    { rango: "Alto", eficiencia: 75, color: "#60a5fa" }
                ]
            });
            setLoading(false);
        };

        const timer = setTimeout(generarDatos, 500);
        return () => clearTimeout(timer);
    }, [usr]);

    return { stats, loading };
};