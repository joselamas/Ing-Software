const url = 'http://localhost:5283/api/Produccion/';

export async function registrarProduccion(datos) {
    try {
        const response = await fetch(url + "registrar", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const data = await response.json();
        if (response.ok) {
            return { status: 1, mensaje: "Producción registrada exitosamente", data: data };
        } else {
            return { status: 0, mensaje: data.mensaje || "Error al registrar la producción" };
        }
    } catch (err) {
        console.error("Error de conexión:", err.message);
        return { status: -1, mensaje: "Error de conexión con el servidor" };
    }
}