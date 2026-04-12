import { useState, useEffect, useMemo } from 'react';
import * as WSColmena from '../../webService/WS_colmena';
import * as WSApiario from '../../webService/WS_apiario';

export const useAlimentarColmena = (colmenaInicial, setViewState, usr) => {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({ titulo: '', mensaje: '', tipo: 'success' });

    const [activeTab, setActiveTab] = useState('individual'); // 'individual' | 'bloque'
    const [apiarios, setApiarios] = useState([]);
    const [todasLasColmenas, setTodasLasColmenas] = useState([]);
    const [searchTermColmena, setSearchTermColmena] = useState('');

    const [formData, setFormData] = useState({
        colmena_id: '',
        apiario_id: '',
        filtro_tipo: '',
        filtro_estado: '',
        fecha: new Date().toISOString().split('T')[0],
        jarabe_activo: false,
        jarabe_cantidad: '',
        jarabe_concentracion: '1:1',
        torta_activo: false,
        torta_cantidad: '',
        polen_activo: false,
        polen_cantidad: '',
        notas: '',
        costo_azucar: '',
        costo_polen: '',
        costo_torta: ''
    });

    useEffect(() => {
        const cargarDatos = async () => {
            if (!usr) return;
            try {
                const [resA, resC] = await Promise.all([
                    WSApiario.ListarApiarios(usr.acronimo),
                    WSColmena.getListColmenasUsr(usr.acronimo)
                ]);
                if (resA.status === 1) setApiarios(resA.apiarios || []);
                if (resC.status === 1) setTodasLasColmenas(resC.data || []);
            } catch (err) {
                console.error("Error cargando datos para alimentación:", err);
            }
        };
        cargarDatos();
    }, [usr]);

    // Filtrar colmenas para el modo bloque en tiempo real
    const colmenasFiltradas = useMemo(() => {
        if (activeTab !== 'bloque' || !formData.apiario_id) return [];
        
        return todasLasColmenas.filter(item => {
            const col = item.colmena;
            const matchApiario = parseInt(formData.apiario_id) === item.apiario_id;
            const matchTipo = !formData.filtro_tipo || col.tipo_colmena === formData.filtro_tipo;
            const matchEstado = !formData.filtro_estado || col.estado === formData.filtro_estado;
            
            return matchApiario && matchTipo && matchEstado;
        });
    }, [activeTab, formData.apiario_id, formData.filtro_tipo, formData.filtro_estado, todasLasColmenas]);

    // Sincronizar si venimos desde una colmena específica
    useEffect(() => {
        if (colmenaInicial && todasLasColmenas.length > 0) {
            const idTarget = colmenaInicial?.colmena?.id || colmenaInicial?.id;
            const encontrada = todasLasColmenas.find(c => c.colmena.id === idTarget);
            if (encontrada) {
                setSearchTermColmena(encontrada.colmena.id_colmena_usuario);
                setFormData(prev => ({ ...prev, colmena_id: idTarget }));
            }
        }
    }, [colmenaInicial, todasLasColmenas]);

    const manejarCambioColmena = (e) => {
        const text = e.target.value;
        setSearchTermColmena(text);

        // Mapeamos el identificador visual al ID de base de datos
        const encontrada = todasLasColmenas.find(c => c.colmena.id_colmena_usuario === text);

        setFormData(prev => ({
            ...prev,
            colmena_id: encontrada ? encontrada.colmena.id : ''
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const enviarAlimentacion = async (e) => {
        e.preventDefault();
        
        if (!formData.jarabe_activo && !formData.torta_activo && !formData.polen_activo) {
            setModalInfo({
                titulo: "Atención",
                mensaje: "Debes seleccionar al menos un tipo de alimento.",
                tipo: "error"
            });
            setIsModalOpen(true);
            return;
        }
        if (activeTab === 'individual' && !formData.colmena_id) {
            setModalInfo({ titulo: "Error", mensaje: "Selecciona una colmena específica.", tipo: "error" });
            setIsModalOpen(true);
            return;
        }
        if (activeTab === 'bloque' && !formData.apiario_id) {
            setModalInfo({ titulo: "Error", mensaje: "Selecciona un apiario para alimentar en bloque.", tipo: "error" });
            setIsModalOpen(true);
            return;
        }

        setLoading(true);
        try {
            const payload = { 
                ...formData, 
                modo: activeTab,
                // Aseguramos que los IDs sean números o null
                colmena_id: formData.colmena_id ? parseInt(formData.colmena_id) : null,
                apiario_id: formData.apiario_id ? parseInt(formData.apiario_id) : null,
                // Enviamos null si los filtros no están seleccionados
                filtro_tipo: formData.filtro_tipo || null,
                filtro_estado: formData.filtro_estado || null
            };

            const res = await WSColmena.registrarAlimentacion(payload);
            if (res.status === 1) {
                setModalInfo({
                    titulo: "¡Registro Exitoso!",
                    mensaje: "La alimentación ha sido registrada correctamente.",
                    tipo: "success"
                });
            } else {
                setModalInfo({
                    titulo: "Error",
                    mensaje: res.mensaje || "No se pudo guardar el registro.",
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

    return { 
        formData, 
        handleChange, 
        enviarAlimentacion, 
        loading, 
        isModalOpen, 
        setIsModalOpen, 
        modalInfo,
        activeTab,
        setActiveTab,
        apiarios,
        todasLasColmenas,
        searchTermColmena,
        manejarCambioColmena,
        colmenasFiltradas
    };
};