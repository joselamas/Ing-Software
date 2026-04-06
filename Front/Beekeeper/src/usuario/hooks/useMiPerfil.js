import { useState, useEffect } from 'react';
import * as WSApiario from '../../webService/WS_apiario.js';
import { apiService } from '../../webService/WS_colmena.js';

export const useMiPerfil = (usr) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiarios, setApiarios] = useState([]);
    const [colmenas, setColmenas] = useState([]);
    const [kgAnual, setKgAnual] = useState([0, 0, 0]);
    const [activeApiariosCount, setActiveApiariosCount] = useState(0);
    const [historicalApiariosCount, setHistoricalApiariosCount] = useState(0);
    const [activeColmenasCount, setActiveColmenasCount] = useState(0);
    const [historicalColmenasCount, setHistoricalColmenasCount] = useState(0);

    useEffect(() => {
        const fetchPerfil = async () => {
            if (!usr) return;
            setLoading(true);
            setError(null);

            try {
                const [apiarioRes, colmenasRes] = await Promise.all([
                    WSApiario.ListarApiarios(usr.acronimo),
                    null
                ]);

                const listaApiarios = apiarioRes.status === 1 ? apiarioRes.apiarios : [];
                const listaColmenas = Array.isArray(colmenasRes) ? colmenasRes : [];

                setApiarios(listaApiarios);
                setColmenas(listaColmenas);

                const activeColmenas = listaColmenas.filter(c => {
                    const prod = c.produccion_kg ?? c.kg_producidos ?? c.kg ?? c.produccion ?? 0;
                    return prod > 0;
                }).length;
                const historicalColmenas = listaColmenas.length - activeColmenas;
                setActiveColmenasCount(activeColmenas);
                setHistoricalColmenasCount(historicalColmenas);
                setActiveApiariosCount(listaApiarios.length);
                setHistoricalApiariosCount(0);

                const totals = [2024, 2025, 2026].map((year) => {
                    return listaColmenas.reduce((sum, colmena) => {
                        const produced = colmena.produccion_kg ?? colmena.kg_producidos ?? colmena.kg ?? colmena.produccion ?? 0;
                        return sum + (typeof produced === 'number' ? produced : 0);
                    }, 0);
                });

                setKgAnual(totals);
            } catch (err) {
                setError('No se pudo cargar la información de perfil.');
            } finally {
                setLoading(false);
            }
        };

        fetchPerfil();
    }, [usr]);

    return {
        loading,
        error,
        apiarios,
        colmenas,
        kgAnual,
        activeApiariosCount,
        historicalApiariosCount,
        activeColmenasCount,
        historicalColmenasCount,
        usuario: usr
    };
};
