import { useState, useEffect } from 'react';
import * as WSApiario from '../../webService/WS_apiario.js';

export const useListarApiarios = (usr, setViewState) => {
    const [apiarios, setApiarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const obtenerApiarios = async () => {
        if (!usr) return;
        setLoading(true);
        console.log("paso por useListarApiarios con usr:", usr);
        try {
            const res = await WSApiario.ObtenerColmenas(usr.acronimo);
            
            if (res && res.status === 1) {
                // Convertimos el string "lat, lng" de SQL a [lat, lng] para Leaflet.
                // Si el valor es inválido, dejamos posicion como null para no romper el mapa.
                const dataProcesada = res.apiarios.map(item => {
                    const apiData = item.apiario;
                    const coordsString = apiData?.coordenadas ? String(apiData.coordenadas).trim() : '';
                    const posicion = coordsString.includes(',')
                        ? coordsString.split(',').map(n => parseFloat(n.trim()))
                        : null;

                    const tienePosicionValida = Array.isArray(posicion)
                        && posicion.length === 2
                        && Number.isFinite(posicion[0])
                        && Number.isFinite(posicion[1]);

                    return {
                        ...apiData,
                        colmenas: item.listColmenas || [],
                        posicion: tienePosicionValida ? posicion : null
                    };
                });
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