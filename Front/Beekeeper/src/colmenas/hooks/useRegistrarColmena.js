import { useState, useEffect } from 'react';
import { apiService } from '../../webService/WS_colmena';
import * as WSApiario from '../../webService/WS_apiario.js';

/**
 * Hook personalizado para manejar la lógica de registro de una colmena.
 */
export const useRegistrarColmena = (usr) => {
    const fechaHoy = new Date().toISOString().split('T')[0];

    const [colmena, setColmena] = useState({
        usuario_acronimo: usr?.acronimo || '',
        tipo_colmena: '',
        fecha_inicio: fechaHoy,
        fecha_inicio_reina: fechaHoy,
        es_enjambre: true,
        id_colmena_madre: '',
        apiario_id: ''
    });
    const [apiarios, setApiarios] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

     const obtenerApiarios = async () => {
            if (!usr) return;            
            try {
                const res = await WSApiario.ListarApiarios(usr.acronimo);
                
                if (res && res.status === 1) {
                    // Convertimos el string "lat, lng" de SQL a [lat, lng] para Leaflet.
                    // Si el valor es inválido, dejamos posicion como null para no romper el mapa.
                    const dataProcesada = res.apiarios.map(apiario => {
                        const coordsString = apiario.coordenadas ? String(apiario.coordenadas).trim() : '';
                        const posicion = coordsString.includes(',')
                            ? coordsString.split(',').map(n => parseFloat(n.trim()))
                            : null;
    
                        const tienePosicionValida = Array.isArray(posicion)
                            && posicion.length === 2
                            && Number.isFinite(posicion[0])
                            && Number.isFinite(posicion[1]);
    
                        return {
                            ...apiario,
                            posicion: tienePosicionValida ? posicion : null
                        };
                    });
                    setApiarios(dataProcesada);
                } else {
                    setError(res.mensaje || "Error al cargar datos.");
                }
            } catch (err) {
                setError("Fallo en la comunicación con el API.");
            } 
        };
    
    // Cargar la lista de apiarios al montar el componente
    useEffect(() => {
        obtenerApiarios();
    }, [usr]);

    const manejarCambio = (e) => {
        const { name, value, type, checked } = e.target;
        setColmena((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const registrar = async (e) => {
        e.preventDefault();

        // Validación rápida
        if (!colmena.apiario_id) {
            setError("Debes asignar la colmena a un apiario.");
            return;
        }
        if (!colmena.es_enjambre && !colmena.id_colmena_madre) {
            setError("Si es una división, debes indicar el ID de la colmena madre.");
            return;
        }

        setCargando(true);
        setError(null);

        try {
            const payload = {
                ...colmena,
                id_colmena_madre: colmena.es_enjambre ? null : (parseInt(colmena.id_colmena_madre) || null),
                fecha_inicio_reina: colmena.es_enjambre ? null : colmena.fecha_inicio_reina,
                apiario_id: parseInt(colmena.apiario_id),
                activo: true,
                estado: "Sana" // Estado inicial por defecto
            };

            const res = await apiService.insertarColmena(payload);
            if (res.ok) {
                alert("Colmena registrada con éxito");
                setColmena({
                    ...colmena,
                    tipo_colmena: '',
                    id_colmena_madre: '',
                    apiario_id: ''
                });
            } else {
                setError("Ocurrió un error al registrar la colmena.");
            }
        } catch (err) {
            setError("No se pudo conectar con el servidor.");
        } finally {
            setCargando(false);
        }
    };

    return { colmena, apiarios, manejarCambio, registrar, cargando, error };
};