import React, { useState, useMemo, useEffect } from 'react';
import { useVerColmenas } from './hooks/useVerColmenas';
import './css/verColmenas.css';
import ModalMSN from '../componentes/modalMSN';

const VerColmenas = (props) => {
    const { colmenas, cargando, error, isModalOpen, setIsModalOpen, modalInfo, desactivarColmena } = useVerColmenas(props.usr);

    const [hiveToDeactivate, setHiveToDeactivate] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        marca: '',
        apiario: '',
        estado: '',
        tipo: '',
        origen: '',
        fechaDesde: '',
        fechaHasta: '',
        soloVencidas: false
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, colmenas, itemsPerPage]);

    const handleOpenConfirm = (colmena) => {
        setHiveToDeactivate(colmena);
        setIsModalOpen(true);
        modalInfo.titulo = "¿Confirmar Baja?";
        modalInfo.mensaje = `¿Estás seguro de que deseas dar de baja la colmena ${colmena.colmena.id_colmena_usuario}?`;
        modalInfo.tipo = "confirm";
    };

    const handleActionConfirm = () => {
        if (hiveToDeactivate) {
            desactivarColmena(hiveToDeactivate.colmena.id);
        }
    };

    const esReinaVencida = (col) => {
        const fechaRef = col.fecha_inicio_reina || col.fecha_inicio;
        if (!fechaRef || fechaRef === "N/A") return false;
        const fechaDate = new Date(fechaRef);
        const limite = new Date();
        limite.setFullYear(limite.getFullYear() - 2);
        return fechaDate < limite;
    };

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const colmenasFiltradas = useMemo(() => {
        return colmenas.filter(item => {
            const col = item.colmena;
            const matchMarca = col.id_colmena_usuario.toLowerCase().includes(filters.marca.toLowerCase());
            const matchApiario = (item.nombre_apiario || "").toLowerCase().includes(filters.apiario.toLowerCase());
            const matchEstado = filters.estado === '' || col.estado === filters.estado;
            const matchTipo = filters.tipo === '' || col.tipo_colmena === filters.tipo;
            const matchOrigen = filters.origen === '' || 
                (filters.origen === 'Enjambre' && col.es_enjambre) || 
                (filters.origen === 'División' && !col.es_enjambre);
            
            const fechaCol = col.fecha_inicio ? col.fecha_inicio.split('T')[0] : '';
            const matchFechaDesde = !filters.fechaDesde || fechaCol >= filters.fechaDesde;
            const matchFechaHasta = !filters.fechaHasta || fechaCol <= filters.fechaHasta;
            
            const vencida = esReinaVencida(col);
            const matchVencimiento = !filters.soloVencidas || vencida;

            return matchMarca && matchApiario && matchEstado && matchTipo && matchOrigen && matchFechaDesde && matchFechaHasta && matchVencimiento;
        });
    }, [colmenas, filters]);

    const totalPages = Math.ceil(colmenasFiltradas.length / itemsPerPage);

    const colmenasPaginadas = useMemo(() => {
        const inicio = (currentPage - 1) * itemsPerPage;
        return colmenasFiltradas.slice(inicio, inicio + itemsPerPage);
    }, [colmenasFiltradas, currentPage]);

    const clearFilters = () => {
        setFilters({
            marca: '', apiario: '', estado: '', tipo: '', origen: '',
            fechaDesde: '', fechaHasta: '', soloVencidas: false
        });
    };

    return (
        <div className="gestion-container">
            <header className="perfil-header list-header">
                <div>
                    <h1>Mis <span>Colmenas</span></h1>
                    <p>Resumen de tus Colmenas: estado, ubicacion,  etc.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button className={`perfil-btn ${showFilters ? 'active-filter' : ''}`} onClick={() => setShowFilters(!showFilters)}>
                        {showFilters ? '✕ Cerrar Filtros' : '🔍 Filtros'}
                    </button>
                    <button className="perfil-btn" onClick={() => props.setViewState("CrearNuevaColmenas")}>
                        + Nueva Colmena
                    </button>
                </div>
            </header>

            {error && <div className="error-msg">{error}</div>}

            {showFilters && (
                <div className="filters-section animate-fade-in">
                    <div className="filters-grid">
                        <div className="input-group">
                            <label>Identificador</label>
                            <input type="text" name="marca" value={filters.marca} onChange={handleFilterChange} placeholder="Buscar marca..." />
                        </div>
                        <div className="input-group">
                            <label>Apiario</label>
                            <input type="text" name="apiario" value={filters.apiario} onChange={handleFilterChange} placeholder="Nombre apiario..." />
                        </div>
                        <div className="input-group">
                            <label>Estado</label>
                            <select name="estado" value={filters.estado} onChange={handleFilterChange}>
                                <option value="">Todos</option>
                                <option value="Nucleo">Núcleo</option>
                                <option value="Crecimiento">Crecimiento</option>
                                <option value="Mantenimiento">Mantenimiento</option>
                                <option value="Produccion">Producción</option>
                                <option value="Vencimiento">Vencimiento</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Tipo</label>
                            <select name="tipo" value={filters.tipo} onChange={handleFilterChange}>
                                <option value="">Todos</option>
                                <option value="Langstroth">Langstroth</option>
                                <option value="Dadant">Dadant</option>
                                <option value="Keniana">Keniana</option>
                                <option value="Layens">Layens</option>
                                <option value="Nucleo">Núcleo</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Origen</label>
                            <select name="origen" value={filters.origen} onChange={handleFilterChange}>
                                <option value="">Todos</option>
                                <option value="Enjambre">Enjambre</option>
                                <option value="División">División</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Desde</label>
                            <input type="date" name="fechaDesde" value={filters.fechaDesde} onChange={handleFilterChange} />
                        </div>
                        <div className="input-group">
                            <label>Hasta</label>
                            <input type="date" name="fechaHasta" value={filters.fechaHasta} onChange={handleFilterChange} />
                        </div>
                        <div className="input-group checkbox-group" style={{ justifyContent: 'center' }}>
                            <input 
                                type="checkbox" 
                                id="soloVencidas" 
                                name="soloVencidas" 
                                checked={filters.soloVencidas} 
                                onChange={handleFilterChange} 
                            />
                            <label htmlFor="soloVencidas" style={{ margin: 0, color: 'var(--danger-dark)' }}>
                                ⚠️ Solo Vencidas
                            </label>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button className="secondary-btn btn-clear-filters" onClick={clearFilters}>
                            Limpiar Filtros
                        </button>
                    </div>
                </div>
            )}

            <div className="table-wrapper">
                {cargando ? (
                    <div className="loading-state">Cargando colmenas...</div>
                ) : (
                    <table className="neobrutalist-table">
                        <thead>
                            <tr>
                                <th>MARCA</th>
                                <th>APIARIO</th>
                                <th>TIPO</th>
                                <th>ORIGEN</th>
                                <th>INSTALACIÓN</th>
                                <th>INICIO REINA</th>
                                <th>ESTADO</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {colmenasPaginadas.map((c) => (
                                <tr key={c.colmena.id}>
                                    <td><strong>{c.colmena.id_colmena_usuario }</strong></td>
                                    <td>{c.nombre_apiario ||  "Sin Apiario"}</td>
                                    <td>{c.colmena.tipo_colmena}</td>
                                    <td>
                                        {(c.colmena.es_enjambre ) ? 
                                            <span className="badge swarm">Enjambre</span> : 
                                            <span className="badge division">División (Madre: {c.colmena.id_colmena_madre})</span>
                                        }
                                    </td>
                                    <td>{c.colmena.fecha_inicio?.split('T')[0]}</td>
                                    <td>{c.colmena.fecha_inicio_reina?.split('T')[0] || "N/A"}</td>
                                    <td>
                                        <span className={`status-pill 
                                            ${c.colmena.estado 
                                                ? c.colmena.estado.toLowerCase()
                                                    .normalize("NFD")
                                                    .replace(/[\u0300-\u036f]/g, "")
                                                    .replace(/\s+/g, "-") 
                                                : 'desconocido'} 
                                            ${esReinaVencida(c.colmena) ? 'vencida' : ''}`}
                                        >
                                            {esReinaVencida(c.colmena) ? 'VENCIDA' : (c.colmena.estado || 'N/A')}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="icon-btn detail" 
                                            onClick={() => {
                                                props.setSelectedColmena(c);
                                                props.setViewState("DetalleColmena");
                                            }} 
                                            title="Ver Detalles"
                                            /* Estilo corregido para que el botón sea blanco y el ojo rojizo */
                                            style={{ 
                                                color: 'transparent',
                                                textShadow: '0 0 0 #8B4513',
                                                fontSize: '1.2rem',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            👁️
                                        </button>

                                        <button className="icon-btn edit" onClick={() => {
                                            props.setSelectedColmena(c);
                                            props.setSelectedApiarioID(c.apiario_id);
                                            props.setViewState("ModificarColmena");
                                        }}>✎</button>

                                        <button className="icon-btn delete" onClick={() => handleOpenConfirm(c)}>
                                            ✖
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="table-footer">
                <div className="items-per-page">
                    <label>Ver:</label>
                    <select 
                        value={itemsPerPage} 
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="items-select"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                    <span className="results-count">de {colmenasFiltradas.length} colmenas</span>
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                            « Anterior
                        </button>
                        <span className="page-info">Página {currentPage} de {totalPages}</span>
                        <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                            Siguiente »
                        </button>
                    </div>
                )}
            </div>

            <ModalMSN 
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                title={modalInfo.titulo}
                message={modalInfo.mensaje}
                type={modalInfo.tipo}
                onConfirm={handleActionConfirm}
            />
        </div>
    );
};

export default VerColmenas;