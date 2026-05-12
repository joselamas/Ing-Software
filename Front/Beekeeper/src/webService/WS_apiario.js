import CONFIG from './config';
const url = CONFIG.URL_APIARIO;


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

export async function ObtenerColmenas(acronimoUsuario) {
    try {
        // Al ser GET, el parámetro viaja en la URL
        // Si acronimoUsuario es "JMLT", la URL queda: .../listarColmenas/JMLT
        const response = await fetch(`${url}listarColmenas/${acronimoUsuario}`, {
            method: "GET", 
            headers: { "Content-Type": "application/json" }
            // No se incluye 'body' porque es una petición GET
        });

        const data = await response.json();
        if (response.ok) {
            // Retornamos status 1 y extraemos la lista de 'data.data' del controlador
            return { 
                status: 1, 
                apiarios: data.data || [] 
            }; 
        } else {
            // Manejo de errores devueltos por el backend (status 400, 404, 500)
            return { 
                status: 0, 
                mensaje: data.mensaje || "Error al obtener el listado de colmenas" 
            };
        }
    } catch (err) {
        // Error de red (CORS, servidor apagado, sin internet)
        console.error("Error de conexión:", err.message);
        return { 
            status: -1, 
            mensaje: "No se pudo establecer conexión con el servidor" 
        };
    }
}
export async function ListarApiarios(acronimoUsuario) {    
    try {
        const response = await fetch(`${url}listar/${acronimoUsuario}`, {
            method: "GET", 
            headers: { "Content-Type": "application/json" }

        });

        const data = await response.json();

        if (response.ok) {
            // Retornamos el status 1 y la lista de apiarios (data)
            return { status: 1, apiarios: data }; 
        } else {
            // Manejo de errores devueltos por el backend
            return { status: 0, mensaje: data.mensaje || "Error al obtener apiarios" };
        }
    } catch (err) {
        // Error de red o servidor caído
        console.error("Error de conexión:", err.message);
        return { status: -1, mensaje: "Error de conexión con el servidor" };
    }
}
export async function ModificarApiario(_apiario) {
    const _body = JSON.stringify(_apiario); 

    try {
        const response = await fetch(url + "actualizar", {
            method: "PATCH", 
            headers: { "Content-Type": "application/json" },
            body: _body 
        });

        const data = await response.json();

      if (response.ok) {
            // Retornamos éxito y la data actualizada del usuario
            return { status: 1, mensaje: "Apiario actualizado", data: data };
        } else {
            return { status: 0, mensaje: data.mensaje || "Error al actualizar apiario" };
        }
    } catch (err) {
        console.error("Error de conexión:", err.message);
        return { status: -1, mensaje: "Error de conexión con el servidor" };
    }
}
