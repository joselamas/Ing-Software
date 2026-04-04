using System.Text;
using Beekepeer.DDBB;
using Beekepeer.Model;
using Beekepeer.Model.ws;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace Beekepeer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly UsuarioConsultas _sql;

        public UsuarioController(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _sql = new UsuarioConsultas(connectionString);
        }

        // 1. OBTENER TODOS LOS USUARIOS
        [HttpGet]
        [Route("list")]
        public ActionResult<List<Usuario>> GetUsuarios()
        {
            return Ok(_sql.GetTodosLosUsuarios());
        }

        [HttpPost]
        [Route("login")]
        public dynamic ValidarLogin([FromBody] LoginRequestWS request)
        {
            try
            {
                // 1. Buscamos al usuario por su identificador (correo o acrónimo)
                // Usamos el método que me pasaste
                Usuario? usuario = _sql.BuscarUsuarioXIdentificador(request.identificador);

                if (usuario == null)
                {
                    return new { status = 0, mensaje = "El usuario no existe en Beekeeper." };
                }

                // 2. Desencriptamos la clave que viene en Base64 desde el Front
                string claveRecibida = (request.clave);

                // 3. Validamos la clave y si el usuario está activo
                if (usuario.clave == claveRecibida)
                {
                    if (!usuario.activo)
                    {
                        return new { status = 0, mensaje = "La cuenta está desactivada. Contacte al administrador." };
                    }

                    // ÉXITO: Retornamos el objeto usuario (limpio de datos sensibles si prefieres)
                    usuario.clave = "";
                    return new
                    {
                        status = 1,
                        mensaje = "Bienvenido al sistema",
                        usuario
                    };
                }
                else
                {
                    return new { status = 0, mensaje = "Contraseña incorrecta." };
                }
            }
            catch (Exception ex)
            {
                return new { status = -1, mensaje = "Error interno: " + ex.Message };
            }
        }
        // 2. BUSCAR POR ACRÓNIMO
        // Ejemplo: api/Usuario/getByAcronimo/JDOE
        [HttpGet]
        [Route("getByAcronimo/{acronimo}")]
        public IActionResult GetByAcronimo(string acronimo)
        {
            var result = _sql.BuscarUsuarioXAcronimo(acronimo);
            if (result == null) return NotFound($"Usuario '{acronimo}' no encontrado.");
            return Ok(result);
        }

        // 3. INSERTAR NUEVO USUARIO
        [HttpPost]
        [Route("insertar")]
        public IActionResult Insertar([FromBody] Usuario nuevo)
        {
            if (nuevo == null || string.IsNullOrEmpty(nuevo.acronimo))
                return BadRequest("Datos de usuario no válidos.");

            bool exito = _sql.InsertarUsuario(
                nuevo.acronimo,
                nuevo.permiso,
                nuevo.nombre,
                nuevo.apellido,
                nuevo.correo,
                nuevo.clave, // Recuerda encriptar esto en una fase posterior
                nuevo.telefono,
                nuevo.localidad_asociada,
                nuevo.activo
            );

            if (!exito)
                return StatusCode(500, new { status = 0, mensaje = "Error al registrar. El acrónimo o correo ya existen." });
            return Ok(new { status = 1, mensaje = "Usuario registrado con éxito." });
        }

        // 4. ACTUALIZACIÓN DINÁMICA (PATCH)
        [HttpPatch]
        [Route("update/{acronimo}")]
        public IActionResult Update(string acronimo, [FromBody] Usuario datos)
        {
            // El acrónimo viene de la URL para identificar al usuario, 
            // el resto de datos viene del cuerpo del JSON.
            bool exito = _sql.ActualizarUsuario(
                acronimo,
                datos.permiso != 0 ? datos.permiso : (int?)null,
                datos.nombre,
                datos.apellido,
                datos.correo,
                datos.clave,
                datos.telefono,
                datos.localidad_asociada,
                datos.activo
            );

            if (!exito) return NotFound("No se pudo actualizar el usuario. Verifique el acrónimo.");
            return Ok("Datos de usuario actualizados correctamente.");
        }

        // 5. ELIMINAR (Borrado Físico)
        [HttpDelete]
        [Route("delete/{acronimo}")]
        public IActionResult Delete(string acronimo)
        {
            bool exito = _sql.EliminarUsuarioxAcronimo(acronimo);
            if (!exito) return NotFound("No se encontró el usuario para eliminar.");
            return Ok("Usuario eliminado permanentemente.");
        }
    }
}