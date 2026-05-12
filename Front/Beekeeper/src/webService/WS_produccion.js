import CONFIG from './config';
const url = CONFIG.URL_PRODUCCION;

export async function registrarProduccion(datos) {

    try {
        const response = await fetch(url + "insertarProduccion", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const data = await response.json();
        if (response.ok) {
            return { 
                status: data.status ?? 1, 
                mensaje: data.mensaje || "Producción registrada exitosamente", 
                data: data 
            };
        } else {
            return { status: 0, mensaje: data.mensaje || "Error al registrar la producción" };
        }
    } catch (err) {
        console.error("Error de conexión:", err.message);
        return { status: -1, mensaje: "Error de conexión con el servidor" };
    }
}


export async function registrarAlimentacion(datos) {
    try {
        const response = await fetch(url + "insertarAlimentacion", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const data = await response.json();
        if (response.ok) {
            // Retornamos directamente la respuesta del backend que ya trae { status, mensaje }
            return data; 
        } else {
            return { 
                status: 0, 
                mensaje: typeof data === 'string' ? data : (data.mensaje || "Error al registrar la alimentación") 
            };
        }
    } catch (err) {
        console.error("Error de conexión:", err.message);
        return { status: -1, mensaje: "Error de conexión con el servidor" };
    }
}

export async function obtenerProduccion(acronimo) {
    let allData = [];
    let offset = 0;
    const limit = 2000;
    let hasMore = true;

    try {
        while (hasMore) {
            // Se pasan los parámetros de paginación sincronizados con el Backend
            const response = await fetch(`${url}listarProduccion?acronimo=${encodeURIComponent(acronimo)}&offset=${offset}&limit=${limit}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                // Manejo de errores basado en las respuestas del controlador .NET
                const errorMsg = await response.text();
                return { status: 0, mensaje: errorMsg || "Error al obtener cosechas" };
            }

            const data = await response.json();
            
            // Verificamos que los datos sean una lista para evitar errores de iteración
            const listaValida = Array.isArray(data) ? data : [];
            
            // IMPORTANTE: Concatenamos el nuevo paquete al acumulador total
            allData = [...allData, ...listaValida];

            // CRITERIO DE PARADA:
            // Si el backend devuelve menos registros de los que pedimos, 
            // significa que ya no quedan más registros en la base de datos.
            if (listaValida.length < limit) {
                hasMore = false;
            } else {
                // Si el paquete vino lleno, incrementamos el offset para el siguiente bloque
                offset += limit;
            }
        }

        // Retornamos el array final con todos los registros unificados
        return { status: 1, data: allData };

    } catch (err) {
        console.error("Error de conexión:", err.message);
        return { status: -1, mensaje: "Error de conexión con el servidor" };
    }
}

export async function obtenerAlimentacion(acronimo) {
    let allData = [];
    let offset = 0;
    const limit = 2000;
    let hasMore = true;

    try {
        while (hasMore) {
            const response = await fetch(`${url}listarAlimentacion?acronimo=${encodeURIComponent(acronimo)}&offset=${offset}&limit=${limit}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                return { status: 0, mensaje: errorMsg || "Error al obtener alimentación" };
            }

            const data = await response.json();
            const listaValida = Array.isArray(data) ? data : [];
            
            // Acumulamos los datos de alimentación
            allData = [...allData, ...listaValida];

            // Si el paquete es menor a 2000, terminamos la descarga
            if (listaValida.length < limit) {
                hasMore = false;
            } else {
                offset += limit;
            }
        }

        return { status: 1, data: allData };

    } catch (err) {
        console.error("Error de conexión:", err.message);
        return { status: -1, mensaje: "Error de conexión con el servidor" };
    }
}

export async function listarProduccionAnual(acronimo) {
    try {
        // Realizamos una única petición ya que este endpoint no está paginado
        const response = await fetch(`${url}listarProduccionAnual?acronimo=${encodeURIComponent(acronimo)}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            // El backend retorna un texto simple en caso de error 500 o BadRequest
            const errorMsg = await response.text();
            return { status: 0, mensaje: errorMsg || "Error al obtener rendimiento anual" };
        }

        const data = await response.json();
        
        // El backend devuelve directamente List<ProduccionAnual>
        const listaValida = Array.isArray(data) ? data : [];

        return { 
            status: 1, 
            data: listaValida 
        };

    } catch (err) {
        console.error("Error de conexión:", err.message);
        return { status: -1, mensaje: "Error de conexión con el servidor" };
    }
}
