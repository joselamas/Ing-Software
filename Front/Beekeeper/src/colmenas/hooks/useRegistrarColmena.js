import { useState, useEffect } from 'react';
import * as WSColmena from '../../webService/WS_colmena';
import * as WSApiario from '../../webService/WS_apiario.js';


export const useRegistrarColmena = (usr) => {
    const fechaHoy = new Date().toISOString().split('T')[0];

    const [colmena, setColmena] = useState({
        usuario_acronimo: usr?.acronimo || '',
        id_colmena_usuario: '',
        tipo_colmena: '',
        fecha_inicio: fechaHoy,
        fecha_inicio_reina: fechaHoy,
        es_enjambre: true,
        id_colmena_madre: '',
        apiario_id: '',
        estado: ''
    });
    const [apiarios, setApiarios] = useState([]);
    const [colmenasMadreDisponibles, setColmenasMadreDisponibles] = useState([]);
    const [searchTermMadre, setSearchTermMadre] = useState('');
    const [cargando, setCargando] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({ titulo: '', mensaje: '', tipo: 'error' });

    
     const obtenerApiarios = async () => {
            if (!usr) return;            
            try {
                const res = await WSApiario.ListarApiarios(usr.acronimo);
                if (res && res.status === 1) {
                    // Convertimos el string "lat, lng" de SQL a [lat, lng] para Leaflet.
                    // Si el valor es inválido, dejamos posicion como null para no romper el mapa.
                    const dataProcesada = res.apiarios.map(item => {
                        const apiData = item;
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
                    setModalInfo({
                        titulo: "Error de Carga",
                        mensaje: res.mensaje || "Error al cargar datos de apiarios.",
                        tipo: "error"
                    });
                    setIsModalOpen(true);
                }
            } catch (err) {
                setModalInfo({
                    titulo: "Error de Conexión",
                    mensaje: "Fallo en la comunicación con el API.",
                    tipo: "error"
                });
                setIsModalOpen(true);
            } 
        };
       const obtenerColmenas = async () => {
    if (!usr) return;            
    try {
        // Llamamos al Web Service
        const res = await WSColmena.getColmena_Id_IdAsig(usr.acronimo); // Asumiendo que este WS devuelve { status: 1, data: [...] }
        if (res && res.status === 1 && Array.isArray(res.data)) {
            setColmenasMadreDisponibles(res.data);
        } else {
            setModalInfo({
                titulo: "Error de Carga",
                mensaje: res?.mensaje || "Error al cargar las colmenas disponibles.",
                tipo: "error"
            });
            setIsModalOpen(true);
        }
    } catch (err) {
        console.error("Error en obtenerColmenas:", err);
        setModalInfo({
            titulo: "Error de Conexión",
            mensaje: "Fallo en la comunicación con el API de colmenas.",
            tipo: "error"
        });
        setIsModalOpen(true);
    } 
};

    // Cargar la lista de apiarios al montar el componente
    useEffect(() => {
        obtenerApiarios();
        obtenerColmenas();
    }, [usr]);

    /**
     * Maneja el cambio en el campo de búsqueda/selección de colmena madre.
     * Mapea la marca visible (id_colmena_usuario) al ID interno.
     */
    const manejarCambioMadre = (e) => {
        const text = e.target.value;
        setSearchTermMadre(text);

        // Buscamos si el texto coincide exactamente con alguna marca conocida
        const encontrada = colmenasMadreDisponibles.find(c => c.id_colmena_usuario === text);

        setColmena(prev => ({
            ...prev,
            id_colmena_madre: encontrada ? encontrada.id : ''
        }));
    };

    const manejarCambio = (e) => {
        const { name, value, type, checked } = e.target;
        setColmena(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const registrar = async (e) => {
        e.preventDefault();

        // Validación rápida
        if (!colmena.apiario_id) {
            setModalInfo({
                titulo: "Campo Requerido",
                mensaje: "Debes asignar la colmena a un apiario.",
                tipo: "error"
            });
            setIsModalOpen(true);
            return;
        }
        if (!colmena.es_enjambre) {
            if (!searchTermMadre.trim()) {
                setModalInfo({
                    titulo: "Campo Requerido",
                    mensaje: "Debes indicar la colmena madre para una división.",
                    tipo: "error"
                });
                setIsModalOpen(true);
                return;
            }
            if (!colmena.id_colmena_madre) {
                setModalInfo({
                    titulo: "Selección Inválida",
                    mensaje: "La colmena madre ingresada no existe. Por favor, selecciónala de la lista de sugerencias.",
                    tipo: "error"
                });
                setIsModalOpen(true);
                return;
            }
        }

        setCargando(true);

        try {
            const apiarioId = parseInt(colmena.apiario_id);
            const payload = {
                ...colmena,
                id_colmena_madre: colmena.es_enjambre ? null : (parseInt(colmena.id_colmena_madre) || null),
                fecha_inicio_reina: colmena.es_enjambre ? null : colmena.fecha_inicio_reina,
                activo: true
            };
            
            // Eliminamos el apiario_id del cuerpo (payload) ya que el servicio 
            // lo requiere por separado como parámetro de la URL.
            delete payload.apiario_id;

            console.log("Payload a enviar:", payload, "APIARIO ID:", apiarioId);
            const res = await WSColmena.insertarColmena(payload, apiarioId);
            
            // El servicio lanza un Error si la respuesta no es ok, por lo que si llegamos aquí, fue exitoso.
            if (res && res.status === 1) { // Aseguramos que la respuesta sea exitosa
                setModalInfo({
                    titulo: "¡Registro Exitoso!",
                    mensaje: "La colmena ha sido creada correctamente.",
                    tipo: "success"
                });
                setIsModalOpen(true);
                setColmena({
                    ...colmena,
                    id_colmena_usuario: '',
                    tipo_colmena: '',
                    id_colmena_madre: '',
                    apiario_id: '',
                    estado: ''
                });
                setSearchTermMadre(''); // Limpiar el buscador
            } else {
                setModalInfo({
                    titulo: "Error de Registro",
                    mensaje: res.mensaje || "Ocurrió un error al registrar la colmena.",
                    tipo: "error"
                });
                setIsModalOpen(true);
            }
        } catch (err) {
            setModalInfo({
                titulo: "Fallo de Servidor",
                mensaje: err.message || "No se pudo conectar con el servidor.",
                tipo: "error"
            });
            setIsModalOpen(true);
        } finally {
            setCargando(false);
        }
    };
    return { colmena, apiarios, colmenasMadreDisponibles, searchTermMadre, manejarCambio, manejarCambioMadre, registrar, cargando, isModalOpen, setIsModalOpen, modalInfo };
};