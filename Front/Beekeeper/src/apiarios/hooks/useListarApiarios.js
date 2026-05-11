import { useState, useEffect, useMemo } from 'react';
import * as WSApiario from '../../webService/WS_apiario.js';

export const useListarApiarios = (usr, setViewState) => {
    const [apiarios, setApiarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para los filtros
    const [filters, setFilters] = useState({
        nombre: '',
        capacidadMin: '',
        altitudMax: '',
        ocupacionRange: '' // 'baja', 'media', 'alta'
    });

    const obtenerApiarios = async () => {
        if (!usr) return;
        setLoading(true);
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

    // Lógica de filtrado computada
    const apiariosFiltrados = useMemo(() => {
        return apiarios.filter(apiary => {
            const matchNombre = apiary.nombre_referencia?.toLowerCase().includes(filters.nombre.toLowerCase());
            const matchCapacidad = filters.capacidadMin ? apiary.capacidad_maxima >= parseInt(filters.capacidadMin) : true;
            const matchAltitud = filters.altitudMax ? apiary.msnm <= parseInt(filters.altitudMax) : true;
            
            let matchOcupacion = true;
            if (filters.ocupacionRange) {
                const total = apiary.colmenas?.length || 0;
                const cap = apiary.capacidad_maxima || 1;
                const porcentaje = (total / cap) * 100;

                if (filters.ocupacionRange === 'vacio') matchOcupacion = total === 0;
                else if (filters.ocupacionRange === 'critico') matchOcupacion = porcentaje > 0 && porcentaje <= 10;
                else if (filters.ocupacionRange === 'baja') matchOcupacion = porcentaje > 10 && porcentaje <= 45;
                else if (filters.ocupacionRange === 'medio') matchOcupacion = porcentaje > 45 && porcentaje <= 75;
                else if (filters.ocupacionRange === 'optimo') matchOcupacion = porcentaje > 75 && porcentaje <= 95;
                else if (filters.ocupacionRange === 'lleno') matchOcupacion = porcentaje > 95;
            }

            return matchNombre && matchCapacidad && matchAltitud && matchOcupacion;
        });
    }, [apiarios, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const limpiarFiltros = () => {
        setFilters({
            nombre: '',
            capacidadMin: '',
            altitudMax: '',
            ocupacionRange: ''
        });
    };

    return { apiarios: apiariosFiltrados, apiariosOriginales: apiarios, loading, error, filters, handleFilterChange, limpiarFiltros, setViewState, refrescar: obtenerApiarios };
};