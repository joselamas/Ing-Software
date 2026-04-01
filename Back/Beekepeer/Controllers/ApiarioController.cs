using Beekepeer.DDBB;
using Beekepeer.Model;
using Microsoft.AspNetCore.Mvc;

namespace Beekepeer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApiarioController : ControllerBase
    {
        private readonly ApiarioConsultas _sql;

        public ApiarioController(IConfiguration configuration)
        {
            // Extraemos la conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _sql = new ApiarioConsultas(connectionString);
        }

        // 1. OBTENER TODOS (O FILTRAR POR USUARIO)
        [HttpGet]
        [Route("list")]
        public ActionResult<List<Apiario>> GetApiarios([FromQuery] string? acronimoUsuario)
        {
            return Ok(_sql.GetApiarios(acronimoUsuario));
        }

        // 2. BUSCAR POR ID
        [HttpGet]
        [Route("getById/{id}")]
        public IActionResult GetById(int id)
        {
            var result = _sql.GetApiarioPorId(id);
            if (result == null) return NotFound($"Apiario con ID {id} no encontrado.");
            return Ok(result);
        }

        // 3. INSERTAR NUEVO APIARIO
        [HttpPost]
        [Route("insert")]
        public IActionResult Insertar([FromBody] Apiario nuevo)
        {
            if (nuevo == null) return BadRequest("Datos del apiario no válidos.");

            int idGenerado = _sql.InsertarApiario(
                nuevo.acronimo_usuario,
                nuevo.nombre_referencia,
                nuevo.coordenadas,
                nuevo.msnm,
                nuevo.activo
            );

            if (idGenerado == 0) return StatusCode(500, "Error al crear el registro en la base de datos.");

            return Ok(new { mensaje = "Apiario creado con éxito", id = idGenerado });
        }

        // 4. ACTUALIZACIÓN DINÁMICA (PATCH)
        // Usamos PATCH porque permite actualizaciones parciales
        [HttpPatch]
        [Route("update/{id}")]
        public IActionResult Update(int id, [FromBody] Apiario datos)
        {
            bool exito = _sql.ActualizarApiario(
                id,
                datos.acronimo_usuario,
                datos.nombre_referencia,
                datos.coordenadas,
                datos.msnm,
                datos.activo
            );

            if (!exito) return NotFound("No se pudo actualizar el apiario. Verifique el ID.");
            return Ok("Apiario actualizado correctamente.");
        }

        // 5. BORRADO LÓGICO (DESACTIVAR)
        [HttpPut]
        [Route("desactivate/{id}")]
        public IActionResult Desactivate(int id)
        {
            bool exito = _sql.DesactivarApiario(id);
            if (!exito) return NotFound("El registro no existe o ya está desactivado.");
            return Ok("Apiario marcado como inactivo.");
        }

        // 6. ELIMINAR FÍSICAMENTE
        [HttpDelete]
        [Route("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool exito = _sql.EliminarApiario(id);
            if (!exito) return NotFound("No se encontró el apiario para eliminar.");
            return Ok("Registro eliminado permanentemente.");
        }
    }
}