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
            bool exito = _sql.ActualizarColmena(             
               // datos.acronimo_usuario
            );

            if (exito)
            {
                // Retornamos el formato que el Hook espera para mostrar el éxito
                return Ok(new { status = 1, mensaje = "¡Apiario actualizado con éxito!", data = datos });
            }
            else
            {
                return NotFound(new { status = 0, mensaje = "No se encontró el Apiario Comuniquese con Soporte." });
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