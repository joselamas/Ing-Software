import React from 'react';
import SelectorApiario from '../apiarios/SelectorApiario';
import GridColmenas from './GridColmenas';
import Button from '../componentes/Button';
import { useDashboardColmenas } from '../hooks/useDashboardColmenas';
import './css/dashboard.css';

const DashboardColmenas = ({ setViewState, usr }) => {
    // Consumimos el Custom Hook
    const { estados, setters, acciones } = useDashboardColmenas(usr);
    

    if (estados.cargando) return <div className="mensaje">Cargando los activos biológicos...</div>;
    if (estados.error) return <div className="error">Hubo un problema: {estados.error}</div>;

    return (
        <div className="contenedor">
            <header className="header">
                <h2>Dashboard de Colmenas Operativas</h2>
                <Button onClick={() => setViewState('Home')} className="btnVolver">
                    Volver al Inicio
                </Button>
            </header>

            <SelectorApiario 
                apiarioSeleccionado={estados.apiarioSeleccionado} 
                onSeleccion={setters.setApiarioSeleccionado} 
                usr={usr}
            />


            <GridColmenas 
            colmenas={estados.colmenasFiltradas} 
            onDesactivar={acciones.desactivarColmena}
            />
        </div>
    );
};

export default DashboardColmenas;