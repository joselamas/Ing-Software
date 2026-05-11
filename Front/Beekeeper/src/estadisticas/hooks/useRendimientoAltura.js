import { useState, useEffect } from 'react';
import { getRendimientoPorAltura } from '../../webService/WS_estadisticas';

export const useRendimientoAltura = (usr) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ dataAltura: [] });

    useEffect(() => {
        const fetchStats = async () => {
            if (!usr?.acronimo) return;
            setLoading(true);
            const response = await getRendimientoPorAltura(usr.acronimo);
            if (response.status === 1) {
                const processedData = response.data.map(d => ({
                    ...d,
                    miel: Number((d.miel || 0).toFixed(2)),
                    polen: Number((d.polen || 0).toFixed(2))
                }));
                setStats({ dataAltura: processedData });
            }
            setLoading(false);
        };

        if (usr) fetchStats();
    }, [usr]);

    return { stats, loading };
};