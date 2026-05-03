import { useState, useEffect } from 'react';
import { getProduccionApiarios } from '../../webService/WS_estadisticas';

export const useAnalisisApiarios = (usr) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ apiariosResumen: [], analisisAltitud: [] });

    useEffect(() => {
        const fetchStats = async () => {
            if (!usr?.acronimo) return;
            setLoading(true);
            
            const response = await getProduccionApiarios(usr.acronimo);
            
            if (response.status === 1) {
                const processedData = response.data.map(api => ({
                    ...api,
                    historico: api.historico
                        .sort((a, b) => a.mes.localeCompare(b.mes)) // Aseguramos orden cronológico
                        .map(h => ({
                            ...h,
                            miel: Number((h.miel || 0).toFixed(2)),
                            polen: Number((h.polen || 0).toFixed(2)),
                            // Agregamos campos de alimentación en 0 para compatibilidad con la vista
                            liquido: 0,
                            solido: 0
                        }))
                }));
                setStats({ apiariosResumen: processedData, analisisAltitud: [] });
            }
            setLoading(false);
        };

        fetchStats();
    }, [usr]);

    return { stats, loading };
};