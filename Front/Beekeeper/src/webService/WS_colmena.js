import CONFIG from './config';

const url = CONFIG.URL_COLMENA;

export async function insertarColmena(nuevaColmena, apiarioId) {
    // 1. Construimos la URL con el parámetro de consulta
    const urlConParams = `${url}insert?apiarioId=${apiarioId}`;
    const _body = JSON.stringify(nuevaColmena);

    try {
        const response = await fetch(urlConParams, {    
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: _body
        });

        // Intentamos obtener el JSON de respuesta (ya sea éxito o error del servidor)
        const data = await response.json();

        if (response.ok) {
            // Alineado con la estructura: status 1 = Éxito
            return { 
                status: 1, 
                mensaje: "¡Colmena registrada exitosamente!", 
                data: data 
            };
        } else {
            // Alineado con la estructura: status 0 = Error controlado por el Back
            return { 
                status: 0, 
                mensaje: data.mensaje || "Error al registrar la colmena en el apiario" 
            };
        }

    } catch (err) {
        // Alineado con la estructura: status -1 = Error de red/conexión
        console.error("Error de conexión en insertarColmena:", err.message);
        return { 
            status: -1, 
            mensaje: "No se pudo conectar con el servidor de Beekeeper" 
        };
    }
}

export async function getListColmenasUsr(usuarioAcronimo) {
    const urlConParams = `${url}getListColmenasUsr?usuarioAcronimo=${encodeURIComponent(usuarioAcronimo)}`;
    try {
        const response = await fetch(urlConParams, {
            method: 'GET', // Coincide con [HttpGet] en el Back
            headers: { 
                'Content-Type': 'application/json' 
            }
        });

        const data = await response.json();

        if (response.ok) {
            // status 1 = Éxito (Igual que tu función base)
            return { 
                status: 1, 
                mensaje: "Colmenas obtenidas con éxito", 
                data: data 
            };
        } else {
            // status 0 = Error controlado (BadRequest, NotFound, etc.)
            return { 
                status: 0, 
                mensaje: data.mensaje || data || "Error al obtener el listado de colmenas" 
            };
        }

    } catch (err) {
        // status -1 = Error de red o servidor caído
        console.error("Error de conexión en getListColmenasUsr:", err.message);
        return { 
            status: -1, 
            mensaje: "No se pudo conectar con el servidor de Beekeeper" 
        };
    }
}
export async function getColmena_Id_IdAsig(acronimoUsuario) {
        const urlConParams = `${url}Colmena_Id_IdAsig?usuarioAcronimo=${encodeURIComponent(acronimoUsuario)}`;

    try {
        // Al ser GET, el parámetro viaja en la URL
        // Si acronimoUsuario es "JMLT", la URL queda: .../listarColmenas/JMLT
        const response = await fetch(urlConParams, {
            method: "GET", 
            headers: { "Content-Type": "application/json" }
            // No se incluye 'body' porque es una petición GET
        });

        const data = await response.json();
        if (response.ok) {
            // Retornamos status 1 y extraemos la lista de 'data.data' del controlador
            return { 
                status: 1, 
                data: data 
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

export async function actualizarColmena(colmena) {
    try {
        const response = await fetch(url + "actualizar", {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(colmena)
        });

        const data = await response.json();

        if (response.ok) 
        {
            return { status: 1, mensaje: "Colmena actualizada", data: data };
        } 
        else 
        {
            // Si .NET rechaza el modelo (Error 400), imprimimos qué campo falló
            if (response.status === 400 && data.errors) 
            {
                console.error("Errores de validación de .NET:", data.errors);
            }
            return { status: 0, mensaje: data.mensaje || "Error al actualizar" };
        }
    } catch (err) {
        console.error("Error de conexión:", err.message);
        return { status: -1, mensaje: "Error de conexión con el servidor" };
    }
}


export async function desactivarColmena(colmenaId) {
    const urlConParams = `${url}desactivate/${colmenaId}`;
    try {
        const response = await fetch(urlConParams, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });

        // Como el C# devuelve Ok("string") y no un JSON, usamos .text()
        const dataText = await response.text(); 

        if (response.ok) {
            // Alineado con la estructura: status 1 = Éxito
            return { 
                status: 1, 
                mensaje: dataText || "Colmena desactivada exitosamente", 
                data: null 
            };
        } else {
            // Alineado con la estructura: status 0 = Error controlado por el Back
            // Si devuelve NotFound("La colmena no existe."), caerá aquí
            return { 
                status: 0, 
                mensaje: dataText || "Error al desactivar la colmena" 
            };
        }

    } catch (err) {
        // Alineado con la estructura: status -1 = Error de red/conexión
        console.error("Error de conexión en desactivarColmena:", err.message);
        return { 
            status: -1, 
            mensaje: "No se pudo conectar con el servidor de Beekeeper" 
        };
    }
}

/**
 * Obtiene el detalle de alimentación y producción de una colmena específica.
 * @param {number} idColmena ID interno de la colmena.
 */
export async function getDetalleMantenimiento(idColmena) {
    const urlConParams = `${url}getDetalleMantenimiento/${idColmena}`;
    try {
        const response = await fetch(urlConParams, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok) {
            return { 
                status: 1, 
                mensaje: "Detalle de mantenimiento obtenido con éxito", 
                data: data 
            };
        } else {
            return { 
                status: 0, 
                mensaje: data.mensaje || data || "Error al obtener el detalle de mantenimiento" 
            };
        }
    } catch (err) {
        console.error("Error de conexión en getDetalleMantenimiento:", err.message);
        return { 
            status: -1, 
            mensaje: "Error de conexión con el servidor de Beekeeper" 
        };
    }
}
