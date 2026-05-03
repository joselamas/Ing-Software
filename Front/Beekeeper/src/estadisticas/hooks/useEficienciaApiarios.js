import { useState, useEffect } from 'react';
import { getEficienciaApiarios } from '../../webService/WS_estadisticas';

export const useEficienciaApiarios = (usr) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ apiariosEficiencia: [] });

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const response = await getEficienciaApiarios(usr?.acronimo);
            
            if (response.status === 1) {
                const processedData = response.data.map(api => ({
                    ...api,
                    historico: api.historico.map(h => ({
                        ...h,
                        eficiencia: Number(h.eficiencia.toFixed(2)),
                        polen: Number(h.polen.toFixed(2))
                    }))
                }));
                setStats({ apiariosEficiencia: processedData });
            }
            setLoading(false);
        };

        if (usr) fetchStats();
    }, [usr]);

    return { stats, loading };
};