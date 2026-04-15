import { useState, useEffect, useMemo } from 'react';
import * as WSColmena from '../../webService/WS_colmena';
import * as WSApiario from '../../webService/WS_apiario';
import * as WSProduccion from '../../webService/WS_produccion';

export const useRegistrarProduccion = (usr, setViewState) => {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({ titulo: '', mensaje: '', tipo: 'success' });

    const [activeTab, setActiveTab] = useState('individual');
    const [apiarios, setApiarios] = useState([]);
    const [todasLasColmenas, setTodasLasColmenas] = useState([]);
    const [searchTermColmena, setSearchTermColmena] = useState('');

    const [formData, setFormData] = useState({
        colmena_id: '',
        apiario_id: '',
        fecha: new Date().toISOString().split('T')[0],
        cantidad_miel: '',
        cantidad_polen: '',
        precio_miel: '',
        precio_polen: '',
        caracteristicas: '',
        es_monofloral: false,
        notas: ''
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
                console.error("Error cargando selectores:", err);
            }
        };
        cargarDatos();
    }, [usr]);

    const colmenasFiltradas = useMemo(() => {
        if (activeTab !== 'bloque' || !formData.apiario_id) return [];
        return todasLasColmenas.filter(item => parseInt(formData.apiario_id) === item.apiario_id);
    }, [activeTab, formData.apiario_id, todasLasColmenas]);

    const manejarCambioColmena = (e) => {
        const text = e.target.value;
        setSearchTermColmena(text);
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

    const submitProduccion = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { 
                ...formData, 
                modo: activeTab,
                colmena_id: formData.colmena_id ? parseInt(formData.colmena_id) : null,
                apiario_id: formData.apiario_id ? parseInt(formData.apiario_id) : null,
                cantidad_miel: parseFloat(formData.cantidad_miel) || 0,
                cantidad_polen: parseFloat(formData.cantidad_polen) || 0,
                precio_miel: parseFloat(formData.precio_miel) || 0,
                precio_polen: parseFloat(formData.precio_polen) || 0,
                caracteristicas: formData.caracteristicas,
                es_monofloral: formData.es_monofloral
            };

            const res = await WSProduccion.registrarProduccion(payload);
            if (res.status === 1) {
                setModalInfo({ titulo: "¡Cosecha Registrada!", mensaje: res.mensaje, tipo: "success" });
            } else {
                setModalInfo({ titulo: "Error", mensaje: res.mensaje, tipo: "error" });
            }
            setIsModalOpen(true);
        } catch (err) {
            setModalInfo({ titulo: "Error", mensaje: "Fallo en la comunicación", tipo: "error" });
            setIsModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return { 
        formData, handleChange, submitProduccion, loading, isModalOpen, setIsModalOpen, modalInfo,
        activeTab, setActiveTab, apiarios, todasLasColmenas, searchTermColmena, manejarCambioColmena, colmenasFiltradas 
    };
};