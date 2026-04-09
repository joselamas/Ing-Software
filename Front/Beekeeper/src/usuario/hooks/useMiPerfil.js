import { useState, useEffect } from 'react';
import * as WSColmena from '../../webService/WS_colmena';
import * as WSApiario from '../../webService/WS_apiario';

/**
 * Hook para gestionar las estadísticas y datos del perfil del usuario.
 */
export const useMiPerfil = (usr) => {
    const [stats, setStats] = useState({
        totalColmenas: 0,
        activas: 0,
        historicas: 0,
        totalApiarios: 0,
        kgAnual: [0, 0, 0] // Datos hardcodeados para kgAnual
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarEstadisticas = async () => {
            if (!usr?.acronimo) return;
            setLoading(true);
            try {
                // Ejecutamos ambas consultas en paralelo para mayor eficiencia
                const [resColmenas, resApiarios] = await Promise.all([
                    WSColmena.getListColmenasUsr(usr.acronimo),
                    WSApiario.ListarApiarios(usr.acronimo)
                ]);

                let colmenasRaw = [];
                if (resColmenas.status === 1) colmenasRaw = resColmenas.data || [];

                let apiariosCount = 0;
                if (resApiarios.status === 1) apiariosCount = resApiarios.apiarios?.length || 0;

                const activas = colmenasRaw.filter(c => c.colmena?.activo).length;

                setStats({
                    totalColmenas: colmenasRaw.length,
                    activas: activas,
                    historicas: colmenasRaw.length - activas,
                    totalApiarios: apiariosCount,
                    kgAnual: [150, 200, 250] // Valores de ejemplo para 2024, 2025, 2026
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