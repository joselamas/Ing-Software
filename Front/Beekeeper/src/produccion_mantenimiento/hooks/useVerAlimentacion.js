import { useState, useEffect, useMemo } from 'react';
import * as WSProduccion from '../../webService/WS_produccion';

export const useVerAlimentacion = (usr) => {
    const [alimentacion, setAlimentacion] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [filters, setFilters] = useState({
        apiario: '',
        colmena: '',
        fechaDesde: '',
        fechaHasta: '',
        tipo: '' // Jarabe, Torta, etc.
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const datosPrueba = [
        { fecha: "2024-05-15T09:00:00", id_colmena_usuario: "ME-01", nombre_apiario: "El Valle", tipo_suministro: "Jarabe", detalle_mezcla: "2:1", cantidad: 5.0, precio_total_insumo: 15.0 },
        { fecha: "2024-05-16T14:20:00", id_colmena_usuario: "ME-05", nombre_apiario: "La Montaña", tipo_suministro: "Torta Proteica", detalle_mezcla: "N/A", cantidad: 0.5, precio_total_insumo: 8.5 },
        { fecha: "2024-05-18T10:45:00", id_colmena_usuario: "C-12", nombre_apiario: "La Loma", tipo_suministro: "Jarabe", detalle_mezcla: "1:1", cantidad: 3.5, precio_total_insumo: 10.0 }
    ];

    useEffect(() => {
        const cargarHistorial = async () => {
            if (!usr) return;
            setLoading(true);
            try {
                const res = await WSProduccion.obtenerAlimentacion(usr.acronimo);
                if (res.status === 1 && res.data.length > 0) {
                    setAlimentacion(res.data);
                } else {
                    setAlimentacion(datosPrueba);
                }
            } catch (err) {
                setAlimentacion(datosPrueba);
            } finally {
                setLoading(false);
            }
        };
        cargarHistorial();
    }, [usr]);

    const dataFiltrada = useMemo(() => {
        return alimentacion.filter(item => {
            const matchApiario = (item.nombre_apiario || "").toLowerCase().includes(filters.apiario.toLowerCase());
            const matchColmena = (item.id_colmena_usuario || "").toLowerCase().includes(filters.colmena.toLowerCase());
            const fechaItem = item.fecha ? item.fecha.split('T')[0] : '';
            const matchDesde = !filters.fechaDesde || fechaItem >= filters.fechaDesde;
            const matchHasta = !filters.fechaHasta || fechaItem <= filters.fechaHasta;
            const matchTipo = !filters.tipo || item.tipo_suministro === filters.tipo;

            return matchApiario && matchColmena && matchDesde && matchHasta && matchTipo;
        });
    }, [alimentacion, filters]);

    useEffect(() => { setCurrentPage(1); }, [filters, itemsPerPage]);

    const totalPages = Math.ceil(dataFiltrada.length / itemsPerPage);
    const dataPaginada = useMemo(() => {
        const inicio = (currentPage - 1) * itemsPerPage;
        return dataFiltrada.slice(inicio, inicio + itemsPerPage);
    }, [dataFiltrada, currentPage, itemsPerPage]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return {
        loading, filters, handleFilterChange, setFilters,
        dataPaginada, totalResults: dataFiltrada.length, currentPage, setCurrentPage, totalPages, itemsPerPage, setItemsPerPage
    };
};