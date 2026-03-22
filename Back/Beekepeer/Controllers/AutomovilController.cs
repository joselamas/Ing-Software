using Beekepeer.DDBB;
using Beekepeer.Model;
using Microsoft.AspNetCore.Mvc;

namespace Beekepeer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AutomovilController : ControllerBase
    {
        automovilConsultas SQLConsultas;

        public AutomovilController(IConfiguration configuration)
        {
            // Mantenemos tu lógica de inicialización
            SQLConsultas = new automovilConsultas(configuration.GetConnectionString("DefaultConnection"));
        }

        // 1. OBTENER TODOS
        [HttpGet]
        [Route("getListAutomovil")]
        public ActionResult<List<automovilClass>> GetAutomovil()
        {
            return Ok(SQLConsultas.GetListAutomovil());
        }

        // 2. BUSCAR POR ID
        [HttpGet]
        [Route("getById/{id}")]
        public IActionResult GetById(int id)
        {
            var result = SQLConsultas.BuscarAutoXId(id);
            if (result == null) return NotFound("Automóvil no encontrado.");
            return Ok(result);
        }

        // 3. BÚSQUEDA DINÁMICA
        [HttpGet]
        [Route("search")]
        public IActionResult Search([FromQuery] string? marca, [FromQuery] string? modelo)
        {
            return Ok(SQLConsultas.BuscarAutomoviles(marca, modelo));
        }

        // 4. ACTUALIZAR MARCA
        [HttpPatch]
        [Route("updateMarca/{id}")]
        public IActionResult UpdateMarca(int id, [FromBody] string nuevaMarca)
        {
            bool exito = SQLConsultas.ModificarMarca(id, nuevaMarca);
            if (!exito) return NotFound("No se pudo actualizar la marca.");
            return Ok("Marca actualizada correctamente.");
        }

        // 5. ACTUALIZAR MODELO
        [HttpPatch]
        [Route("updateModelo/{id}")]
        public IActionResult UpdateModelo(int id, [FromBody] string nuevoModelo)
        {
            bool exito = SQLConsultas.ModificarModelo(id, nuevoModelo);
            if (!exito) return NotFound("No se pudo actualizar el modelo.");
            return Ok("Modelo actualizado correctamente.");
        }

        // 6. ELIMINAR
        [HttpDelete]
        [Route("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool exito = SQLConsultas.EliminarAutomovil(id);
            if (!exito) return NotFound("El ID no existe.");
            return Ok("Registro eliminado.");
        }

        // 7. INSERTAR
        [HttpPost]
        [Route("insert")]
        public IActionResult Insertar([FromBody] automovilClass nuevoAuto)
        {
            if (nuevoAuto == null) return BadRequest("Datos inválidos.");

            bool exito = SQLConsultas.InsertarAutomovil(nuevoAuto.Marca, nuevoAuto.Modelo);
            if (!exito) return StatusCode(500, "Error al insertar el registro.");

            return Ok("Automóvil insertado con éxito.");
        }
    }
}