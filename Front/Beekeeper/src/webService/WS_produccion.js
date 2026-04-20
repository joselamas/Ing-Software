const url = 'http://localhost:5283/api/ProduccionMantenimiento/';

export async function registrarProduccion(datos) {
    console.log("Datos enviados a WS_produccion.registrarProduccion:", datos);

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
    console.log("Datos enviados a WS_produccion.registrarAlimentacion:", datos);
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
    try {
        const response = await fetch(`${url}listarProduccion?acronimo=${encodeURIComponent(acronimo)}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        if (response.ok) {
            // Ajuste para manejar si el backend retorna el array directamente o envuelto en un objeto
            const listaValida = Array.isArray(data) ? data : (data.data || []);
            return { status: 1, data: listaValida };
        } else {
            return { status: 0, mensaje: data.mensaje || "Error al obtener cosechas" };
        }
    } catch (err) {
        console.error("Error de conexión:", err.message);
        return { status: -1, mensaje: "Error de conexión con el servidor" };
    }
}

export async function obtenerAlimentacion(acronimo) {
    try {
        const response = await fetch(`${url}listarAlimentacion?acronimo=${encodeURIComponent(acronimo)}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        if (response.ok) {
            // Ajuste para manejar si el backend retorna el array directamente o envuelto en un objeto
            const listaValida = Array.isArray(data) ? data : (data.data || []);
            return { status: 1, data: listaValida };
        } else {
            return { status: 0, mensaje: data.mensaje || "Error al obtener alimentación" };
        }
    } catch (err) {
        console.error("Error de conexión:", err.message);
        return { status: -1, mensaje: "Error de conexión con el servidor" };
    }
}
