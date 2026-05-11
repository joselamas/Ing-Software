import { useState, useEffect } from 'react';
import * as WSColmena from '../../webService/WS_colmena';
import * as WSApiario from '../../webService/WS_apiario';
import * as WSProduccion from '../../webService/WS_produccion';

/**
 * Hook para gestionar las estadísticas y datos del perfil del usuario.
 */
export const useMiPerfil = (usr) => {
    const [stats, setStats] = useState({
        totalColmenas: 0,
        activas: 0,
        historicas: 0,
        totalApiarios: 0,
        produccionAnual: [],
        apiarios: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarEstadisticas = async () => {
            if (!usr?.acronimo) return;
            setLoading(true);
            try {
                // Ejecutamos las tres consultas en paralelo para mayor eficiencia
                const [resColmenas, resApiarios, resProduccion] = await Promise.all([
                    WSColmena.getListColmenasUsr(usr.acronimo),
                    WSApiario.ObtenerColmenas(usr.acronimo),
                    WSProduccion.listarProduccionAnual(usr.acronimo)
                ]);

                let colmenasRaw = [];
                if (resColmenas.status === 1) colmenasRaw = resColmenas.data || [];

                let apiariosCount = 0;
                let apiariosList = [];
                if (resApiarios.status === 1) {
                    apiariosList = (resApiarios.apiarios || []).map(item => ({
                        ...item.apiario,
                        numColmenas: item.listColmenas?.length || 0
                    }));
                    apiariosCount = apiariosList.length;
                }

                let produccionAnual = [];
                if (resProduccion.status === 1) produccionAnual = resProduccion.data || [];

                const activas = colmenasRaw.filter(c => c.colmena?.activo).length;

                setStats({
                    totalColmenas: colmenasRaw.length,
                    activas: activas,
                    historicas: colmenasRaw.length - activas,
                    totalApiarios: apiariosCount,
                    produccionAnual: produccionAnual,
                    apiarios: apiariosList
                });
            } catch (err) {
                setError("Error al sincronizar estadísticas del perfil.");
            } finally {
                setLoading(false);
            }
        };

        cargarEstadisticas();
    }, [usr]);

    return { stats, loading, error };
};