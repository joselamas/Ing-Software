import { useState, useEffect, useMemo } from 'react';
import * as WSProduccion from '../../webService/WS_produccion';

export const useVerCosechas = (usr) => {
    const [cosechas, setCosechas] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [filters, setFilters] = useState({
        apiario: '',
        colmena: '',
        fechaDesde: '',
        fechaHasta: '',
        tipo: '' // Miel o Polen
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const cargarHistorial = async () => {
            if (!usr) return;
            setLoading(true);
            try {
                const res = await WSProduccion.obtenerProduccion(usr.acronimo);
                if (res.status === 1) {
                    setCosechas(res.data);
                } else {
                    setCosechas([]); // Si el WS falla o no tiene datos, se establece una lista vacía
                }
            } catch (err) {
                console.error("Error cargando cosechas:", err);
                setCosechas([]); // En caso de error de conexión, también se establece una lista vacía
            } finally {
                setLoading(false);
            }
        };
        cargarHistorial();
    }, [usr]);

    const dataFiltrada = useMemo(() => {
        return cosechas.filter(item => {
            const prod = item.produccion || {};
            const matchApiario = (item.nombre_referencia_Apiario || "").toLowerCase().includes(filters.apiario.toLowerCase());
            const matchColmena = (item.id_colmena_usuario || "").toLowerCase().includes(filters.colmena.toLowerCase());
            const fechaItem = prod.fecha ? prod.fecha.split('T')[0] : '';
            const matchDesde = !filters.fechaDesde || fechaItem >= filters.fechaDesde;
            const matchHasta = !filters.fechaHasta || fechaItem <= filters.fechaHasta;
            const matchTipo = !filters.tipo || prod.tipo_producto === filters.tipo;

            return matchApiario && matchColmena && matchDesde && matchHasta && matchTipo;
        });
    }, [cosechas, filters]);

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