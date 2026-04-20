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
        es_monofloral: false
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
        return todasLasColmenas.filter(item => {
            const matchApiario = String(formData.apiario_id) === String(item.apiario_id);
            const estado = item.colmena?.estado?.toLowerCase() || "";
            const matchEstado = estado.includes("Productiva") || estado.includes("productiva");
            return matchApiario && matchEstado;
        });
    }, [activeTab, formData.apiario_id, todasLasColmenas]);

    // Validación de formulario completo y correcto
    const isFormValid = useMemo(() => {
        const originSelected = activeTab === 'individual' 
            ? !!formData.colmena_id 
            : (!!formData.apiario_id && colmenasFiltradas.length > 0);
        
        if (!originSelected) return false;

        const cantMiel = parseFloat(formData.cantidad_miel) || 0;
        const cantPolen = parseFloat(formData.cantidad_polen) || 0;
        const precioMiel = parseFloat(formData.precio_miel) || 0;
        const precioPolen = parseFloat(formData.precio_polen) || 0;

        // Debe haber al menos una cantidad registrada
        if (cantMiel <= 0 && cantPolen <= 0) return false;

        // Si hay cantidad de un producto, debe haber un precio asociado > 0
        if (cantMiel > 0 && precioMiel <= 0) return false;
        if (cantPolen > 0 && precioPolen <= 0) return false;

        return true;
    }, [formData, activeTab, colmenasFiltradas]);

    // Contamos las colmenas que están en estado 'Produccion' para el modo apiario
    const countProductivas = useMemo(() => {
        return colmenasFiltradas.length;
    }, [colmenasFiltradas]);

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

        const cantMiel = parseFloat(formData.cantidad_miel) || 0;
        const cantPolen = parseFloat(formData.cantidad_polen) || 0;
        const precioMiel = parseFloat(formData.precio_miel) || 0;
        const precioPolen = parseFloat(formData.precio_polen) || 0;

        // Validación de seguridad antes de procesar costos
        if ((cantMiel > 0 && precioMiel <= 0) || (cantPolen > 0 && precioPolen <= 0)) {
            setModalInfo({ titulo: "Atención", mensaje: "agregar costo al pruducto a ingresar", tipo: "error" });
            setIsModalOpen(true);
            return;
        }

        setLoading(true);
        try {
            // Función para generar la lista de productos por colmena (Miel/Polen)
            const obtenerProductosColmena = (id) => {
                const productos = [];
                const base = {
                    colmena_id: parseInt(id),
                    fecha: formData.fecha,
                    tipo_origen: formData.es_monofloral ? "Monofloral" : "Multifloral",
                    descripcion_flora: formData.caracteristicas
                };

                if (cantMiel > 0) {
                    if (activeTab !== 'bloque' || !formData.apiario_id)
                        productos.push({
                            ...base,
                            tipo_producto: "Miel",
                            cantidad_kg: cantMiel,
                            precio_aprox_kg: precioMiel
                        });
                        else {
                             productos.push({
                            ...base,
                            tipo_producto: "Miel",
                            cantidad_kg: cantMiel/colmenasFiltradas.length,
                            precio_aprox_kg: precioMiel
                        });
                        }

                }
                if (cantPolen > 0) {
                    if (activeTab !== 'bloque' || !formData.apiario_id)
                        productos.push({
                            ...base,
                            tipo_producto: "Polen",
                            cantidad_kg: cantPolen,
                            precio_aprox_kg: precioPolen
                        });
                    else {
                        productos.push({
                            ...base,
                            tipo_producto: "Polen",
                            cantidad_kg: cantPolen/colmenasFiltradas.length,
                            precio_aprox_kg: precioPolen
                        });
                    }
                }
                return productos;
            };

            let payload = [];
            if (activeTab === 'individual') {
                payload = obtenerProductosColmena(formData.colmena_id);
            } else {
                // En bloque, aplanamos la lista de todos los productos para todas las colmenas filtradas
                payload = colmenasFiltradas.flatMap(item => obtenerProductosColmena(item.colmena.id));
            }

            const res = await WSProduccion.registrarProduccion(payload);
            if (res.status === 1) {
                setModalInfo({ 
                    titulo: "¡Cosecha Registrada!", 
                    mensaje: res.mensaje || "La producción ha sido guardada con éxito.", 
                    tipo: "success" 
                });
            } else {
                setModalInfo({ 
                    titulo: "Error", 
                    mensaje: res.mensaje || "No se pudo guardar el registro de producción.", 
                    tipo: "error" 
                });
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
        activeTab, setActiveTab, apiarios, todasLasColmenas, searchTermColmena, manejarCambioColmena, colmenasFiltradas, countProductivas, isFormValid
    };
};