import React from 'react';
import '../App.css';
import '../estadisticas/css/estadisticas.css';

const Home = () => {
    return (
        <div className="gestion-container">
            <header className="perfil-header">
                <div>
                    <h1>Panel de <span>Control</span></h1>
                    <p>Bienvenido a BeeKeeper. Tu centro de control integral para la gestión y optimización de la producción apícola.</p>
                </div>
            </header>

            <div className="stats-grid-dashboard animate-fade-in">
                <div className="stat-card">
                    <label>Entorno</label>
                    <h2>Apiarios</h2>
                    <p>Gestiona tus asentamientos, define la flora predominante y controla la geolocalización exacta de cada zona de pecoreo.</p>
                </div>

                <div className="stat-card highlight">
                    <label>Inventario</label>
                    <h2>Colmenas</h2>
                    <p>Control individual por marcas. Seguimiento detallado de tipos de colmena, origen (enjambres o divisiones) y estados de salud.</p>
                </div>

                <div className="stat-card">
                    <label>Suministros</label>
                    <h2>Nutrición</h2>
                    <p>Registra la alimentación suplementaria. Monitorea el uso de jarabes líquidos y tortas proteicas para asegurar la supervivencia.</p>
                </div>

                <div className="stat-card highlight">
                    <label>Rendimiento</label>
                    <h2>Cosechas</h2>
                    <p>Historial preciso de producción de miel y polen. Identifica tus colmenas élite y analiza la productividad por temporada.</p>
                </div>

                <div className="stat-card">
                    <label>Inteligencia</label>
                    <h2>Análisis</h2>
                    <p>Visualiza el rendimiento basado en la altitud y pisos térmicos. Optimiza tus traslados con datos reales de eficiencia.</p>
                </div>
            </div>

            <div className="altura-info-box" style={{ marginTop: '30px', boxShadow: '6px 6px 0px var(--dark-brown)' }}>
                <strong>Sugerencia de inicio:</strong> Comienza registrando un apiario en la sección de gestión para poder asignar tus colmenas y empezar el seguimiento de producción.
            </div>
        </div>
    );
};

export default Home;