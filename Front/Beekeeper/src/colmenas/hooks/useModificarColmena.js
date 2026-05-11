import { useState, useEffect } from 'react';
import * as WSColmena from '../../webService/WS_colmena';
import * as WSApiario from '../../webService/WS_apiario.js';

export const useModificarColmena = (colmenaInicial, setViewState, usr, selectedApiarioID) => {
    const datosColmena = colmenaInicial?.colmena || colmenaInicial;
    const idApiarioActual = selectedApiarioID || colmenaInicial?.apiario_id || datosColmena?.apiario_id || '';

    const [formData, setFormData] = useState({
        id: datosColmena?.id,
        id_colmena_usuario: datosColmena?.id_colmena_usuario || '',
        tipo_colmena: datosColmena?.tipo_colmena || '',
        estado: datosColmena?.estado || '',
        fecha_inicio: datosColmena?.fecha_inicio?.split('T')[0] || '',
        es_enjambre: datosColmena?.es_enjambre ?? true,
        id_colmena_madre: datosColmena?.id_colmena_madre || '',
        fecha_inicio_reina: datosColmena?.fecha_inicio_reina?.split('T')[0] || '',
        activo: datosColmena?.activo ?? true,
        apiario_id: idApiarioActual
    });

    const [loading, setLoading] = useState(false);
    const [apiarios, setApiarios] = useState([]);
    const [colmenasMadreDisponibles, setColmenasMadreDisponibles] = useState([]);
    const [searchTermMadre, setSearchTermMadre] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({ titulo: '', mensaje: '', tipo: 'success' });

    // Cargar datos necesarios (Apiarios y Colmenas Madre)
    useEffect(() => {
        const cargarDatos = async () => {
            if (!usr) return;
            try {
                const [resA, resC] = await Promise.all([
                    WSApiario.ListarApiarios(usr.acronimo),
                    WSColmena.getColmena_Id_IdAsig(usr.acronimo)
                ]);

                if (resA && resA.status === 1) setApiarios(resA.apiarios || []);
                if (resC && resC.status === 1 && Array.isArray(resC.data)) {
                    setColmenasMadreDisponibles(resC.data);
                }
            } catch (err) {
                console.error("Error al cargar datos iniciales:", err);
            }
        };
        cargarDatos();
    }, [usr]);

    // Resolver el nombre de la colmena madre inicial para el buscador
    useEffect(() => {
        if (colmenasMadreDisponibles.length > 0 && formData.id_colmena_madre) {
            const encontrada = colmenasMadreDisponibles.find(c => c.id === parseInt(formData.id_colmena_madre));
            if (encontrada) setSearchTermMadre(encontrada.id_colmena_usuario);
        }
    }, [colmenasMadreDisponibles, formData.id_colmena_madre]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const manejarCambioMadre = (e) => {
        const text = e.target.value;
        setSearchTermMadre(text);

        // Buscamos si el texto coincide exactamente con alguna marca conocida
        const encontrada = colmenasMadreDisponibles.find(c => c.id_colmena_usuario === text);

        setFormData(prev => ({
            ...prev,
            id_colmena_madre: encontrada ? encontrada.id : ''
        }));
    };

    const manejarEdicion = async (e) => {
        e.preventDefault();

        // Validaciones de Colmena Madre
        if (!formData.es_enjambre) {
            if (!searchTermMadre.trim() || !formData.id_colmena_madre) {
                setModalInfo({
                    titulo: "Selección Inválida",
                    mensaje: "Debes seleccionar una colmena madre válida de la lista.",
                    tipo: "error"
                });
                setIsModalOpen(true);
                return;
            }
        }

        setLoading(true);

        try {
            const payload = {
                ...formData,
                usuario_acronimo: usr.acronimo,
                fecha_inicio: formData.fecha_inicio ? formData.fecha_inicio : null,
                id_colmena_madre: formData.es_enjambre ? null : (parseInt(formData.id_colmena_madre) || null),
                fecha_inicio_reina: formData.es_enjambre ? null : (formData.fecha_inicio_reina ? formData.fecha_inicio_reina : null),
                apiario_id: parseInt(formData.apiario_id)
            };

            const res = await WSColmena.actualizarColmena(payload);
            
            if (res && res.status === 1) {
                setModalInfo({
                    titulo: "¡Colmena Actualizada!",
                    mensaje: "Los cambios se han guardado correctamente.",
                    tipo: "success"
                });
            } else {
                setModalInfo({
                    titulo: "Error",
                    mensaje: res.mensaje || "No se pudo actualizar la colmena.",
                    tipo: "error"
                });
            }
            setIsModalOpen(true);
        } catch (err) {
            setModalInfo({
                titulo: "Fallo de Conexión",
                mensaje: "Error al comunicar con el servidor.",
                tipo: "error"
            });
            setIsModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return { formData, apiarios, colmenasMadreDisponibles, searchTermMadre, manejarCambioMadre, handleChange, manejarEdicion, loading, isModalOpen, setIsModalOpen, modalInfo };
};