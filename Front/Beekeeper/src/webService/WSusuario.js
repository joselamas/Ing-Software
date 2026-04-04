const url = 'http://localhost:5283/api/Usuario/'; 



export async function CrearUsuario(usr) {
    const _body = JSON.stringify(usr);
    let usuario = {};
    try {
        const response = await fetch(url + "insertar", {
            method: "POST", // 1. Especificar el método POST
            headers: {
                "Content-Type": "application/json" // 2. Headers solo para el tipo de contenido
            },
            body: _body 
        });
            debugger;

        console.log(response)
        if (response.ok) {
            console.log(response)
            usuario = await response.json();
        } else {
            // Maneja errores 400 (BadRequest) o 500 del servidor
            const errorText = await response.json();
            usuario = errorText ;
        }
    } catch (err) {
        console.log("---------------error de conexión--------------------------");
        console.log(err.message);
        usuario = { status: -1, mensaje: err.message };
    }

    return usuario;
}
export async function UpdateUsuario(usr) {
    var _body =  JSON.stringify(usr)
    var usuario = {};
    await fetch(url + "UpdateUsuario",{
      headers: {"content-type": 'application/json',   body: _body},
    })
            .then((response) => response.json())
            .then((data) => {   
               usuario = data
              })
            .catch((err) => {              
              console.log("---------------error--------------------------")
              console.log(err.message);        
            });
    return usuario;    
}

export async function ValidarLogin(identificador, clave) {
    // Creamos el objeto con los nombres que espera C# (LoginRequest)
    console.log(clave)
    const datosLogin = {
        identificador: identificador,
        clave: clave
    };

    const _body = JSON.stringify(datosLogin);
    let resultado = {};

    try {
        const response = await fetch(url + "login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: _body
        });

        if (response.ok) {
            // Login exitoso (200 OK)
            resultado = await response.json();
        } else {
            // Maneja 401 (Credenciales incorrectas) o 404 (No existe)
            try {
                // Intentamos leer el JSON de error que configuramos en el Controller
                resultado = await response.json(); 
            } catch {
                // Si el servidor no mandó un JSON, leemos el texto plano
                const errorText = await response.text();
                resultado = { status: 0, mensaje: errorText || "Error de autenticación" };
            }
        }
    } catch (err) {
        console.log("---------------error de red--------------------------");
        resultado = { status: -1, mensaje: "No hay conexión con el servidor de Beekeeper." };
    }

    return resultado;
}
