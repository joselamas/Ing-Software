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


        [HttpPost]
        [Route("insertarAlimentacion")]
        public IActionResult insertarAlimentacion([FromBody] List<Alimentacion> data)
        {
            if (data == null || !data.Any())
                return BadRequest(new { status = 0, mensaje = "La lista de datos está vacía." });

            int total = data.Count;
            int exitos = 0;
            List<string> errores = new List<string>();

            foreach (var item in data)
            {
                // 1. Validación individual
                if (item.precio_total_insumo == null || item.precio_total_insumo < 0)
                {
                    errores.Add($"[{item.tipo_suministro}]: Precio no válido");
                    continue;
                }

                try
                {
                    // 2. Intento de inserción
                    int resultado = _sql.InsertarAlimentacion(item);

                    if (resultado > 0)
                        exitos++;
                    else
                        errores.Add($"[{item.tipo_suministro}]: Error en base de datos");
                }
                catch (Exception ex)
                {
                    errores.Add($"[{item.tipo_suministro}]: {ex.Message}");
                }
            }

            // --- CONSTRUCCIÓN DE LA RESPUESTA UNIFICADA ---

            if (exitos == total)
            {
                // Caso Ideal: Todo salió bien
                return Ok(new
                {
                    status = 1,
                    mensaje = $"Se registraron los {total} insumos con éxito."
                });
            }
            else if (exitos > 0)
            {
                // Caso Mixto: Algunos fallaron (Mantenemos status 1 porque hubo progreso, o 0 si prefieres ser estricto)
                return Ok(new
                {
                    status = 1,
                    mensaje = $"Registro parcial: {exitos} exitosos de {total}. Errores: {string.Join(" | ", errores)}"
                });
            }
            else
            {
                // Caso Fallido: Nada se insertó
                return StatusCode(500, new
                {
                    status = 0,
                    mensaje = $"Error total al registrar. Detalles: {string.Join(" | ", errores)}"
                });
            }
        }
    }
}
