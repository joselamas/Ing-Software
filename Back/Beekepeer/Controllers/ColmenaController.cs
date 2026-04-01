using Beekepeer.DDBB;
using Beekepeer.Model;
using Microsoft.AspNetCore.Mvc;

namespace Beekepeer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ColmenaController : ControllerBase
    {
        private readonly ColmenaConsultas _sql;

        public ColmenaController(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _sql = new ColmenaConsultas(connectionString);
        }

        // 1. OBTENER TODAS O POR USUARIO
        // Ejemplo: api/Colmena/list?usuarioAcronimo=JUAN
        [HttpGet]
        [Route("list")]
        public ActionResult<List<Colmena>> GetColmenas([FromQuery] string? usuarioAcronimo)
        {
            return Ok(_sql.GetColmenas(usuarioAcronimo));
        }

        // 2. INSERTAR NUEVA COLMENA
        [HttpPost]
        [Route("insert")]
        public IActionResult Insertar([FromBody] Colmena nueva)
        {
            if (nueva == null) return BadRequest("Datos de la colmena no válidos.");

            int idGenerado = _sql.InsertarColmena(
                nueva.usuario_acronimo,
                nueva.fecha_inicio,
                nueva.es_enjambre,
                nueva.id_colmena_madre,
                nueva.activo
            );

            if (idGenerado == 0) return StatusCode(500, "Error al registrar la colmena.");

            return Ok(new { mensaje = "Colmena registrada con éxito", id = idGenerado });
        }

        // 3. ACTUALIZACIÓN DINÁMICA (PATCH)
        [HttpPatch]
        [Route("update/{id}")]
        public IActionResult Update(int id, [FromBody] Colmena datos)
        {
            bool exito = _sql.ActualizarColmena(
                id,
                datos.usuario_acronimo,
                datos.fecha_inicio,
                datos.es_enjambre,
                datos.id_colmena_madre,
                datos.activo
            );

            if (!exito) return NotFound("No se encontró la colmena o no hubo cambios.");
            return Ok("Colmena actualizada correctamente.");
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