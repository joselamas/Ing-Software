using Beekepeer.DDBB;
using Beekepeer.Model;
using Beekepeer.Model.ws;
using Microsoft.AspNetCore.Mvc;

namespace Beekepeer.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ProduccionMantenimientoController : Controller
    {
        private readonly ProduccionMantenimientoConsutas _sql;

        public ProduccionMantenimientoController(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _sql = new ProduccionMantenimientoConsutas(connectionString);
        }

        // 3. INSERTAR NUEVO USUARIO
        [HttpPost]
        [Route("insertarProduccion")]
        public IActionResult insertarProduccion([FromBody] Produccion data)
        {
            if (data.precio_aprox_kg == null || data.precio_aprox_kg < 0)
                return BadRequest("Datos de produccion no válidos.");

            int exito = _sql.InsertarProduccion(data);

            if (exito == 0 )
                return StatusCode(500, new { status = 0, mensaje = "Error al registrar la Produccion, intentelo mas tarde." });
            return Ok(new { status = 1, mensaje = "Produccion registrado con éxito." });
        }

        // 3. INSERTAR NUEVO USUARIO
        [HttpPost]
        [Route("insertarAlimentacion")]
        public IActionResult insertarAlimentacion([FromBody] Alimentacion data)
        {
            if (data.precio_total_insumo == null ||  data.precio_total_insumo < 0)
                return BadRequest("Datos de usuario no válidos.");

            int exito = _sql.InsertarAlimentacion( data );

            if (exito == 0)
                return StatusCode(500, new { status = 0, mensaje = "Error al registrar. El acrónimo o correo ya existen." });
            return Ok(new { status = 1, mensaje = "Usuario registrado con éxito." });
        }

    }
}
