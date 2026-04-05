import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

export const useFormularioColmena = (usr) => {
    // 1. ESTADOS
    const [apiarioId, setApiarioId] = useState('');
    const [esEnjambre, setEsEnjambre] = useState(true);
    const [idColmenaMadre, setIdColmenaMadre] = useState('');
    
    const fechaHoy = new Date().toISOString().split('T')[0];
    const [fechaInicio, setFechaInicio] = useState(fechaHoy);

    const [apiarios, setApiarios] = useState([]);
    const [cargandoEnvio, setCargandoEnvio] = useState(false);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    // 2. EFECTOS (Carga inicial)
    useEffect(() => {
        const cargarApiarios = async () => {
            try {
                // Llamamos a la capa de servicios en lugar de hacer el fetch aquí
                const data = await apiService.obtenerApiarios(usr);
                setApiarios(data);
            } catch (err) {
                console.error("Error al cargar apiarios", err);
            }
        };
        cargarApiarios();
    }, [usr]);

    // 3. LÓGICA DE NEGOCIO (Envío del formulario)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: '', tipo: '' });

        if (!apiarioId) {
            return setMensaje({ texto: 'Debes seleccionar un Apiario.', tipo: 'error' });
        }
        if (!esEnjambre && !idColmenaMadre) {
            return setMensaje({ texto: 'Indica el ID de la Colmena Madre para la trazabilidad.', tipo: 'error' });
        }

        setCargandoEnvio(true);

        const nuevaColmena = {
            usuario_acronimo: usr.acronimo,
            fecha_inicio: fechaInicio,
            es_enjambre: esEnjambre,
            id_colmena_madre: esEnjambre ? null : parseInt(idColmenaMadre),
            activo: true,
            apiario_id: parseInt(apiarioId)
        };

        try {
            // Llamamos a la capa de servicios
            await apiService.insertarColmena(nuevaColmena);
            
            setMensaje({ texto: '¡Colmena registrada exitosamente!', tipo: 'exito' });
            
            // Limpiamos los campos
            setEsEnjambre(true);
            setIdColmenaMadre('');
            
        } catch (err) {
            setMensaje({ texto: err.message, tipo: 'error' });
        } finally {
            setCargandoEnvio(false);
        }
    };

    // 4. RETORNAMOS LO QUE LA INTERFAZ NECESITA
    return {
        estados: { apiarioId, esEnjambre, idColmenaMadre, fechaInicio, apiarios, cargandoEnvio, mensaje },
        setters: { setApiarioId, setEsEnjambre, setIdColmenaMadre, setFechaInicio },
        handleSubmit
    };
};