import { useState, useEffect } from 'react';
import * as WSApiario from '../../webService/WS_apiario.js';

export const useListarApiarios = (usr, setViewState) => {
    const [apiarios, setApiarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const obtenerApiarios = async () => {
        if (!usr) return;
        setLoading(true);
        
        try {
            const res = await WSApiario.ListarApiarios(usr.acronimo);
            
            if (res && res.status === 1) {
                // Convertimos el string "lat, lng" de SQL a [lat, lng] para Leaflet
                const dataProcesada = res.apiarios.map(apiario => ({
                    ...apiario,
                    posicion: apiario.coordenadas 
                        ? apiario.coordenadas.split(',').map(n => parseFloat(n.trim()))
                        : [8.5891, -71.1450] // Default Mérida si no hay coords
                }));
                setApiarios(dataProcesada);
            } else {
                setError(res.mensaje || "Error al cargar datos.");
            }
        } catch (err) {
            setError("Fallo en la comunicación con el API.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerApiarios();
    }, [usr]);

    return { apiarios, loading, error, setViewState, refrescar: obtenerApiarios };
};