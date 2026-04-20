import { useState, useEffect, useMemo } from 'react';
import * as WSProduccion from '../../webService/WS_produccion';

export const useVerRegistros = (usr) => {
    const [cosechas, setCosechas] = useState([]);
    const [alimentacion, setAlimentacion] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('cosecha'); // 'cosecha' | 'alimentacion'
    
    const [filters, setFilters] = useState({
        apiario: '',
        colmena: '',
        fechaDesde: '',
        fechaHasta: '',
        tipo: '' // Miel/Polen o Jarabe/Torta...
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const cargarHistorial = async () => {
            if (!usr) return;
            setLoading(true);
            try {
                const [resP, resA] = await Promise.all([
                    WSProduccion.obtenerProduccion(usr.acronimo),
                    WSProduccion.obtenerAlimentacion(usr.acronimo)
                ]);
                if (resP.status === 1) setCosechas(resP.data);
                if (resA.status === 1) setAlimentacion(resA.data);
            } catch (err) {
                console.error("Error cargando historial:", err);
            } finally {
                setLoading(false);
            }
        };
        cargarHistorial();
    }, [usr]);

    const dataFiltrada = useMemo(() => {
        const listaBase = activeTab === 'cosecha' ? cosechas : alimentacion;
        return listaBase.filter(item => {
            const matchApiario = (item.nombre_apiario || "").toLowerCase().includes(filters.apiario.toLowerCase());
            const matchColmena = (item.id_colmena_usuario || "").toLowerCase().includes(filters.colmena.toLowerCase());
            
            const fechaItem = item.fecha ? item.fecha.split('T')[0] : '';
            const matchDesde = !filters.fechaDesde || fechaCol >= filters.fechaDesde;
            const matchHasta = !filters.fechaHasta || fechaCol <= filters.fechaHasta;
            
            const tipoActual = activeTab === 'cosecha' ? item.tipo_producto : item.tipo_suministro;
            const matchTipo = !filters.tipo || tipoActual === filters.tipo;

            return matchApiario && matchColmena && matchDesde && matchHasta && matchTipo;
        });
    }, [activeTab, cosechas, alimentacion, filters]);

    useEffect(() => { setCurrentPage(1); }, [filters, activeTab, itemsPerPage]);

    const totalPages = Math.ceil(dataFiltrada.length / itemsPerPage);
    const dataPaginada = useMemo(() => {
        const inicio = (currentPage - 1) * itemsPerPage;
        return dataFiltrada.slice(inicio, inicio + itemsPerPage);
    }, [dataFiltrada, currentPage, itemsPerPage]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({ apiario: '', colmena: '', fechaDesde: '', fechaHasta: '', tipo: '' });
    };

    return {
        activeTab, setActiveTab, loading, filters, handleFilterChange, clearFilters,
        dataPaginada, totalResults: dataFiltrada.length, currentPage, setCurrentPage, totalPages, itemsPerPage, setItemsPerPage
    };
};