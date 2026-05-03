import { useState, useEffect } from 'react';
import { getProduccionApiarios, getAlimentacionApiarios } from '../../webService/WS_estadisticas';

export const useAnalisisApiarios = (usr) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ apiariosResumen: [], analisisAltitud: [] });

    useEffect(() => {
        const fetchStats = async () => {
            if (!usr?.acronimo) return;
            setLoading(true);
            
            const [prodRes, alimRes] = await Promise.all([
                getProduccionApiarios(usr.acronimo),
                getAlimentacionApiarios(usr.acronimo)
            ]);
            
            const apiariesMap = {};

            const mergeData = (data, isProd) => {
                if (!data) return;
                data.forEach(api => {
                    if (!apiariesMap[api.nombre]) {
                        apiariesMap[api.nombre] = { nombre: api.nombre, historico: {} };
                    }
                    api.historico.forEach(h => {
                        if (!apiariesMap[api.nombre].historico[h.mes]) {
                            apiariesMap[api.nombre].historico[h.mes] = { 
                                mes: h.mes, miel: 0, polen: 0, liquido: 0, solido: 0 
                            };
                        }
                        const target = apiariesMap[api.nombre].historico[h.mes];
                        if (isProd) {
                            target.miel = Number((h.miel || 0).toFixed(2));
                            target.polen = Number((h.polen || 0).toFixed(2));
                        } else {
                            target.liquido = Number((h.jarabe || 0).toFixed(2));
                            target.solido = Number((h.torta || 0).toFixed(2));
                        }
                    });
                });
            };

            if (prodRes.status === 1) mergeData(prodRes.data, true);
            if (alimRes.status === 1) mergeData(alimRes.data, false);

            const apiariosResumen = Object.values(apiariesMap).map(api => ({
                ...api,
                historico: Object.values(api.historico).sort((a, b) => a.mes.localeCompare(b.mes))
            }));

            if (apiariosResumen.length > 0) {
                setStats({ apiariosResumen, analisisAltitud: [] });
            }
            setLoading(false);
        };

        fetchStats();
    }, [usr]);

    return { stats, loading };
};