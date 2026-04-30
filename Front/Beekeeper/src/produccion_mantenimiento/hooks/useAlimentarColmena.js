import { useState, useEffect, useMemo } from 'react';
import * as WSColmena from '../../webService/WS_colmena';
import * as WSApiario from '../../webService/WS_apiario';
import * as WSProduccionAlimentacion from '../../webService/WS_produccion';


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

        // Validación de costos obligatorios por cada suministro activo
        const faltaCostoJarabe = formData.jarabe_activo && (!formData.costo_azucar || parseFloat(formData.costo_azucar) <= 0);
        const faltaCostoTorta = formData.torta_activo && (!formData.costo_torta || parseFloat(formData.costo_torta) <= 0);
        const faltaCostoPolen = formData.polen_activo && (!formData.costo_polen || parseFloat(formData.costo_polen) <= 0);

        if (faltaCostoJarabe || faltaCostoTorta || faltaCostoPolen) {
            setModalInfo({ titulo: "Atención", mensaje: "agregar costo al pruducto a ingresar", tipo: "error" });
            setIsModalOpen(true);
            return;
        }

        setLoading(true);
        try {
            // Mapeo dinámico según la estructura "Alimentacion" del backend
            const tiposConfig = [
                { activo: 'jarabe_activo', tipo: 'Jarabe', detalle: formData.jarabe_concentracion, cant: 'jarabe_cantidad', costo: 'costo_azucar' },
                { activo: 'torta_activo', tipo: 'Torta Proteica', detalle: 'N/A', cant: 'torta_cantidad', costo: 'costo_torta' },
                { activo: 'polen_activo', tipo: 'Polen', detalle: 'N/A', cant: 'polen_cantidad', costo: 'costo_polen' }
            ];

           
            const obtenerAlimentacionColmena = (id) => {
                return tiposConfig
                    .filter(cfg => formData[cfg.activo])
                    .map(cfg => ({
                        colmena_id: parseInt(id),
                        fecha: formData.fecha,
                        tipo_suministro: cfg.tipo,
                        detalle_mezcla: cfg.detalle,
                        cantidad: parseFloat(formData[cfg.cant]) || 0,
                        precio_total_insumo: parseFloat(formData[cfg.costo]) || 0,
                        observaciones: formData.notas || ""
                    }));
            };

            let payload = [];
            if (activeTab === 'individual') {
                payload = obtenerAlimentacionColmena(formData.colmena_id);
            } else {
                // En bloque, aplanamos la lista de todos los alimentos para todas las colmenas filtradas
                payload = colmenasFiltradas.flatMap(item => obtenerAlimentacionColmena(item.colmena.id));
            }

            // Única llamada al servidor con la lista completa
            const res = await WSProduccionAlimentacion.registrarAlimentacion(payload);
            
            if (res.status === 1) {
                setModalInfo({
                    titulo: "¡Registro Exitoso!",
                    mensaje: res.mensaje || "Los datos de alimentación se guardaron correctamente.",
                    tipo: "success"
                });
                
                setFormData({
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
                setSearchTermColmena('');
            } else {
                setModalInfo({
                    titulo: "Atención",
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
        setSearchTermColmena,
        manejarCambioColmena,
        colmenasFiltradas
    };
};