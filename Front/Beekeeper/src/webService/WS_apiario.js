const url = 'http://localhost:5283/api/Apiario/'; 

export async function CrearApiario(_apiario) {
    const _body = JSON.stringify(_apiario);
    try {
        const response = await fetch(url + "insertar", {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: _body 
        });

        const data = await response.json();

        if (response.ok) {
            return { status: 1, mensaje: "¡Apiario creado!", data: data };
        } else {
            return { status: 0, mensaje: data.mensaje || "Error al crear apiario" };
        }
    } catch (err) {
        console.error("Error de conexión:", err.message);
        return { status: -1, mensaje: "Error de conexión con el servidor" };
    }
}

export async function ListarApiarios(acronimoUsuario) {
    // El backend suele esperar un objeto, ej: { acronimo: 'ABC' }
    const _body = JSON.stringify({ acronimo: acronimoUsuario }); 
    
    try {
        const response = await fetch(url + "listar", {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: _body 
        });

        const data = await response.json();

        if (response.ok) {
            // Retornamos el status 1 y la lista de apiarios que viene en data
            return { status: 1, apiarios: data }; 
        } else {
            return { status: 0, mensaje: data.mensaje || "Error al obtener apiarios" };
        }
    } catch (err) {
        console.error("Error de conexión:", err.message);
        return { status: -1, mensaje: "Error de conexión con el servidor" };
    }
}