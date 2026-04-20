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

    useEffect(() => {
        const cargarHistorial = async () => {
            if (!usr) return;
            setLoading(true);
            try {
                const res = await WSProduccion.obtenerAlimentacion(usr.acronimo);
                if (res.status === 1) {
                    setAlimentacion(res.data);
                } else {
                    setAlimentacion([]);
                }
            } catch (err) {
                console.error("Error cargando historial de alimentación:", err);
                setAlimentacion([]);
            } finally {
                setLoading(false);
            }
        };
        cargarHistorial();
    }, [usr]);

    const dataFiltrada = useMemo(() => {
        return alimentacion.filter(item => {
            const alim = item.alimentacion || {};
            const matchApiario = (item.nombre_referencia_Apiario || "").toLowerCase().includes(filters.apiario.toLowerCase());
            const matchColmena = (item.id_colmena_usuario || "").toLowerCase().includes(filters.colmena.toLowerCase());
            const fechaItem = alim.fecha ? alim.fecha.split('T')[0] : '';
            const matchDesde = !filters.fechaDesde || fechaItem >= filters.fechaDesde;
            const matchHasta = !filters.fechaHasta || fechaItem <= filters.fechaHasta;
            const matchTipo = !filters.tipo || alim.tipo_suministro === filters.tipo;

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