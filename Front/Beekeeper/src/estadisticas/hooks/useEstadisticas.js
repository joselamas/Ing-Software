import { useState, useEffect } from 'react';
import { getEstadisticasGlobales } from '../../webService/WS_estadisticas';

export const useEstadisticas = (usr) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        roi: { porcentaje: 0, beneficio: 0, ingresos: 0, egresos: 0 },
        produccionTotal: { miel: 0, polen: 0 },
        gastoTotal: { liquido: 0, solido: 0 },
        rankingElite: [],
        comparativaMeses: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const response = await getEstadisticasGlobales(usr);
            
            if (response.status === 1) {
                const data = response.data;
                // Mapeo para mantener compatibilidad con las claves que usaba el mock en el frontend
                setStats({
                    ...data,
                    roi: {
                        ...data.roi,
                        porcentaje: Number((data.roi?.porcentaje || 0).toFixed(2))
                    },
                    produccionTotal: {
                        miel: Number((data.produccionTotal?.totalMiel || 0).toFixed(2)),
                        polen: Number((data.produccionTotal?.totalPolen || 0).toFixed(2))
                    },
                    gastoTotal: {
                        liquido: Number((data.gastoTotal?.totalLiquido || 0).toFixed(2)),
                        solido: Number((data.gastoTotal?.totalSolido || 0).toFixed(2))
                    }
                });
            }
            setLoading(false);
        };

        if (usr) fetchStats();
    }, [usr]);

    const formatMoneda = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val);
    };

    return { stats, loading, formatMoneda };
};