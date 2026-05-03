import { useState, useEffect } from 'react';
import { getRendimientoPorAltura } from '../../webService/WS_estadisticas';

export const useRendimientoAltura = (usr) => {
    const [loading, setLoading] = useState(true);
    const [status, setStats] = useState({ dataAltura: [] });

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const response = await getRendimientoPorAltura(usr.acronimo);
            if (response.status === 1) {
                const processedData = response.data.map(d => ({
                    ...d,
                    miel: Number(d.miel.toFixed(2)),
                    polen: Number(d.polen.toFixed(2))
                }));
                setStats({ dataAltura: processedData });
            }
            setLoading(false);
        };

        if (usr) fetchStats();
    }, [usr]);

    return { status, loading };
};