const url = 'http://localhost:5283/api/ProduccionMantenimiento/';

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
