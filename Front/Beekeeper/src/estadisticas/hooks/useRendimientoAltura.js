import { useState, useEffect } from 'react';

export const useRendimientoAltura = (usr) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const generarDatos = () => {
            // Definimos los rangos de 500m hasta 3500m
            const rangos = [
                "0-500m", "501-1000m", "1001-1500m", "1501-2000m", 
                "2001-2500m", "2501-3000m", "3001-3500m"
            ];

            const dataAltura = rangos.map((rango, index) => {
                // Simulación de rendimientos: el pico suele estar en altitudes medias (1000-2000m)
                const factorAltura = [0.6, 0.9, 1.4, 1.5, 1.1, 0.8, 0.4][index];
                
                return {
                    rango,
                    miel: Number((Math.random() * 15 * factorAltura + 8).toFixed(2)),
                    polen: Number((Math.random() * 4 * factorAltura + 2).toFixed(2))
                };
            });

            setStats({ dataAltura });
            setLoading(false);
        };

        // Simulamos latencia de red para la carga
        const timer = setTimeout(generarDatos, 800);
        return () => clearTimeout(timer);
    }, [usr]);

    return { stats, loading };
};