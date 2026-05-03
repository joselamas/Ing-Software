// URL base para el controlador de Estadísticas/Análisis
const url = "http://localhost:5283/api/Estadisticas/"; 

/**
 * Obtiene el resumen global de estadísticas (ROI, Producción Total, Gastos)
 * y los datos para la gráfica de tendencia y ranking élite.
 */
export async function getEstadisticasGlobales(usr) {
    try {
        const response = await fetch(`${url}global?acronimo=${usr.acronimo}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok) {
            return { 
                status: 1, 
                mensaje: "Estadísticas cargadas correctamente", 
                data: data 
            };
        } else {
            return { 
                status: 0, 
                mensaje: data.mensaje || "Error al calcular rendimientos" 
            };
        }
    } catch (err) {
        console.error("Error en getEstadisticasGlobales:", err.message);
        return { 
            status: -1, 
            mensaje: "Error de conexión con el servicio de análisis" 
        };
    }
}

/**
 * Obtiene la eficiencia promedio por apiario (Kg/Colmena)
 */
export async function getEficienciaApiarios(usuarioAcronimo) {
    try {
        const response = await fetch(`${url}eficiencia?acronimo=${usuarioAcronimo}`);
        const data = await response.json();
        
        if (response.ok) {
            return { status: 1, data: data };
        }
        return { status: 0, mensaje: "No se pudo obtener la eficiencia" };
    } catch (err) {
        return { status: -1, mensaje: err.message };
    }
}

/**
 * Obtiene el rendimiento segmentado por altura (msnm)
 */
export async function getRendimientoPorAltura(usuarioAcronimo) {
    try {
        const response = await fetch(`${url}rendimiento-altura?acronimo=${usuarioAcronimo}`);
        const data = await response.json();
        
        if (response.ok) {
            return { status: 1, data: data };
        }
        return { status: 0, mensaje: "Error en análisis geográfico" };
    } catch (err) {
        return { status: -1, mensaje: err.message };
    }
}

/**
 * Obtiene el desglose detallado de producción y alimentación por apiario
 */
/**
 * Obtiene el historial de producción (miel y polen) de los apiarios
 */
export async function getProduccionApiarios(usuarioAcronimo) {
    try {
        const response = await fetch(`${url}produccion?acronimo=${usuarioAcronimo}`);
        const data = await response.json();
        
        if (response.ok) {
            return { status: 1, data: data };
        }
        return { status: 0, mensaje: "No se pudo obtener la producción" };
    } catch (err) {
        console.error("Error en getProduccionApiarios:", err.message);
        return { 
            status: -1, 
            mensaje: "Error de conexión con el servicio de producción" 
        };
    }
}