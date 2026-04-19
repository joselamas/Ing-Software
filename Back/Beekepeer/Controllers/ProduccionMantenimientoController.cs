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
        public IActionResult insertarProduccion([FromBody] List<Produccion> data)
        {
            // 1. Validación de lista nula o vacía
            if (data == null || !data.Any())
                return BadRequest(new { status = 0, mensaje = "No se recibió ninguna producción para registrar." });

            int totalAProcesar = data.Count;
            int exitos = 0;
            List<string> errores = new List<string>();

            foreach (var item in data)
            {
                // 2. Validación de reglas de negocio para cada registro
                if (item.precio_aprox_kg < 0 || item.cantidad_kg <= 0)
                {
                    errores.Add($"[ID Colmena: {item.colmena_id}]: Cantidad o precio inválidos.");
                    continue;
                }

                try
                {
                    // 3. Intento de inserción en la DB
                    // Usamos el método que ya preparamos con SCOPE_IDENTITY() y GETDATE()
                    int idGenerado = _sql.InsertarProduccion(item);

                    if (idGenerado > 0)
                        exitos++;
                    else
                        errores.Add($"[ID Colmena: {item.colmena_id}]: La base de datos rechazó el registro.");
                }
                catch (Exception ex)
                {
                    // Capturamos cualquier error de conexión o SQL específico de este item
                    errores.Add($"[ID Colmena: {item.colmena_id}]: {ex.Message}");
                }
            }

            // --- CONSTRUCCIÓN DE LA RESPUESTA (MISMA ESTRUCTURA QUE ALIMENTACIÓN) ---

            if (exitos == totalAProcesar)
            {
                return Ok(new
                {
                    status = 1,
                    mensaje = $"Éxito: Se registraron las {totalAProcesar} cosechas correctamente."
                });
            }
            else if (exitos > 0)
            {
                // Resultado mixto
                return Ok(new
                {
                    status = 1,
                    mensaje = $"Registro parcial: {exitos} de {totalAProcesar} procesados. Detalles: {string.Join(" | ", errores)}"
                });
            }
            else
            {
                // Fallo total
                return StatusCode(500, new
                {
                    status = 0,
                    mensaje = $"No se pudo registrar ninguna producción. Errores: {string.Join(" | ", errores)}"
                });
            }
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
