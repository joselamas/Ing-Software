using Beekepeer.DDBB;
using Beekepeer.Model;
using Beekepeer.DTOs;
using Microsoft.AspNetCore.Mvc;
using Beekepeer.Model.ws;

namespace Beekepeer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ColmenaController : ControllerBase
    {
        private readonly ColmenaConsultas _sql;
        private readonly ApiarioColmenaConsultas _sqlApiarioColmena;


        public ColmenaController(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _sql = new ColmenaConsultas(connectionString);
            _sqlApiarioColmena = new ApiarioColmenaConsultas(connectionString);
        }

     

        // 1. OBTENER TODAS O POR USUARIO
        [HttpGet]
        [Route("getListColmenasUsr")]
        public ActionResult<List<ColmenaWS>> GetLisColmenas([FromQuery] string? usuarioAcronimo)
        {
            // 1. Validación de entrada
            if (string.IsNullOrWhiteSpace(usuarioAcronimo))
            {
                return BadRequest("El acrónimo del usuario es obligatorio para listar las colmenas.");
            }

            try
            {
                // 2. Ejecución
                var resultado = _sql.GetLisColmenas(usuarioAcronimo);

                // 3. Validación de contenido
                if (resultado == null || resultado.Count == 0)
                {
                    // Retornamos un 200 con lista vacía, o un 404 si prefieres ser estricto
                    return Ok(new List<ColmenaWS>());
                }

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                // 4. Log del error (puedes usar console para ahora)
                Console.WriteLine($"Error al listar colmenas: {ex.Message}");
                return StatusCode(500, "Ocurrió un error interno al procesar la solicitud.");
            }
        }

        [HttpGet]
        [Route("Colmena_Id_IdAsig")]
        public ActionResult<List<Colmena_Id_IdAsig>> GetLisIdsColmenas([FromQuery] string? usuarioAcronimo)
        {
            // 1. Validación de entrada
            if (string.IsNullOrWhiteSpace(usuarioAcronimo))
            {
                return BadRequest("El acrónimo del usuario es obligatorio para listar las colmenas.");
            }

            try
            {
                // 2. Ejecución
                var resultado = _sql.GetLisIdsColmenas(usuarioAcronimo);

                // 3. Validación de contenido
                if (resultado == null || resultado.Count == 0)
                {
                    // Retornamos un 200 con lista vacía, o un 404 si prefieres ser estricto
                    return Ok(new List<Colmena_Id_IdAsig>());
                }

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                // 4. Log del error (puedes usar console para ahora)
                Console.WriteLine($"Error al listar colmenas: {ex.Message}");
                return StatusCode(500, "Ocurrió un error interno al procesar la solicitud.");
            }
        }


        // 2. INSERTAR NUEVA COLMENA
        [HttpPost]
        [Route("insert")]
        // Recibimos la colmena desde el Body y el ID del apiario desde la Query
        public IActionResult Insertar([FromBody] Colmena nueva, [FromQuery] int apiarioId)
        {
            if (nueva == null) return BadRequest("Datos de la colmena no válidos.");
            if (apiarioId <= 0) return BadRequest("Debe especificar un ID de apiario válido.");

            // 1. Insertamos la colmena (esta función ya la tienes)
            int idGenerado = _sql.InsertarColmena(
                nueva.usuario_acronimo,
                nueva.fecha_inicio,
                nueva.fecha_inicio_reina,
                nueva.es_enjambre,
                nueva.id_colmena_madre,
                nueva.activo,
                nueva.tipo_colmena,
                nueva.estado,
                nueva.id_colmena_usuario
            );

            if (idGenerado == 0) return StatusCode(500, "Error al registrar la colmena (posible ID duplicado).");

            // 2. Insertamos la relación con el apiario usando el 'apiarioId' que vino por la URL
            int relacionExitosa = _sqlApiarioColmena.InsertarColmenaEnApiario(
                nueva.usuario_acronimo,
                idGenerado,
                apiarioId,        
                nueva.fecha_inicio
            );

            if (relacionExitosa == 0) return StatusCode(500, "Colmena creada, pero falló la asignación al apiario.");

            return Ok(new { mensaje = "Colmena registrada con éxito", id = idGenerado });
        }


        [HttpPatch]
        [Route("actualizar")]
        public IActionResult ActualizarColmena([FromBody] ColmenaRequest datos)
        {
            try
            {
                // Llamamos al método de actualización dinámica pasándole todos los datos
                bool exito = _sql.ActualizarColmena(
                    id: datos.id,
                    usuarioAcronimo: datos.usuario_acronimo,
                    fechaInicio: datos.fecha_inicio,
                    esEnjambre: datos.es_enjambre,
                    idColmenaMadre: datos.id_colmena_madre,
                    activo: datos.activo,
                    apiarioId: datos.apiario_id,
                    tipoColmena: datos.tipo_colmena,
                    fechaInicioReina: datos.fecha_inicio_reina,
                    estado: datos.estado,
                    idColmenaUsuario: datos.id_colmena_usuario
                );

                if (exito)
                {
                    return Ok(new { status = 1, mensaje = "¡Colmena actualizada con éxito!", data = datos });
                }
                else
                {
                    // Ocurre si el ID de la colmena no existe en la base de datos
                    return NotFound(new { status = 0, mensaje = "No se encontró la colmena a actualizar." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error SQL al actualizar colmena: {ex.Message}");
                return StatusCode(500, new { status = 0, mensaje = "Error interno del servidor: " + ex.Message });
            }
        }





        // 4. DESACTIVAR (Borrado Lógico)
        [HttpPut]
        [Route("desactivate/{id}")]
        public IActionResult Desactivate(int id)
        {
            bool exito = _sql.DesactivarColmena(id);
            if (!exito) return NotFound("La colmena no existe.");
            return Ok("Colmena desactivada.");
        }

        // 5. ELIMINAR (Borrado Físico)
        [HttpDelete]
        [Route("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool exito = _sql.BorrarColmena(id);
            if (!exito) return NotFound("No se pudo eliminar la colmena.");
            return Ok("Registro eliminado permanentemente.");
        }
    }
}