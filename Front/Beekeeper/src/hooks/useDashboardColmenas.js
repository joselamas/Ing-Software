import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

export const useDashboardColmenas = (usr) => {
    const [colmenas, setColmenas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [apiarioSeleccionado, setApiarioSeleccionado] = useState('');

    useEffect(() => {
        const fetchColmenas = async () => {
            try {
                const data = await apiService.obtenerColmenas(usr);
                setColmenas(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        fetchColmenas();
    }, [usr]);

    // Lógica de filtrado en memoria
    const colmenasFiltradas = apiarioSeleccionado 
        ? colmenas.filter(colmena => colmena.apiario_id === parseInt(apiarioSeleccionado))
        : colmenas;

    const desactivar = async (id) => {
        // Confirmación rápida
        if (window.confirm("¿Estás seguro de que deseas dar de baja esta colmena?")) {
            try {
                await apiService.desactivarColmena(id);
                // Actualizamos el estado local para que desaparezca sin refrescar la página
                setColmenas(prev => prev.filter(c => c.id !== id));
            } catch (err) {
                alert(err.message);
            }
        }
    };
    return {
        estados: { cargando, error, apiarioSeleccionado, colmenasFiltradas },
        setters: { setApiarioSeleccionado },
        acciones: { desactivar }
    };
};