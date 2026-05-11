using Beekepeer.DDBB;
using Beekepeer.Model;
using Beekepeer.Model.ws;
using Beekepeer.Model.ws.stadistica;
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


        [HttpGet]
        [Route("listarProduccion")]
        public IActionResult getListProduccion([FromQuery] string acronimo, [FromQuery] int offset , [FromQuery] int limit)
        {
            // 1. Validación de lista nula o vacía
            if (string.IsNullOrWhiteSpace(acronimo))
            {
                return BadRequest("El acrónimo del usuario es obligatorio para listar la producción.");
            }

            try
            {
                // 2. Ejecución: Ahora pasamos offset y limit a la capa de datos
                var resultado = _sql.getListProduccion(acronimo, offset, limit);

                // 3. Validación de contenido
                if (resultado == null || resultado.Count == 0)
                {
                    // Retornamos un 200 con lista vacía para que el frontend sepa que ya no hay más datos (hasMore = false)
                    return Ok(new List<ProduccionWS>());
                }

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                // 4. Log del error 
                Console.WriteLine($"Error al listar producción: {ex.Message}");
                return StatusCode(500, "Ocurrió un error interno al procesar la solicitud.");
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


        [HttpGet]
        [Route("listarAlimentacion")]
        public IActionResult getListAlimentacion([FromQuery] string acronimo, [FromQuery] int offset = 0, [FromQuery] int limit = 1000)
        {
            if (string.IsNullOrWhiteSpace(acronimo))
            {
                return BadRequest("El acrónimo del usuario es obligatorio para listar la alimentación.");
            }

            try
            {
                // Pasamos offset y limit a la capa SQL
                var resultado = _sql.getListAlimentacion(acronimo, offset, limit);

                if (resultado == null || resultado.Count == 0)
                {
                    return Ok(new List<AlimentacionWS>());
                }

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al listar alimentación: {ex.Message}");
                return StatusCode(500, "Ocurrió un error interno al procesar la solicitud.");
            }
        }


        [HttpGet]
        [Route("listarProduccionAnual")]
        public IActionResult getProduccionAnual([FromQuery] string acronimo)
        {
            if (string.IsNullOrWhiteSpace(acronimo))
            {
                return BadRequest("El acrónimo del usuario es obligatorio para obtener el rendimiento anual.");
            }

            try
            {
                // Llamada a la capa SQL para obtener el histórico de 3 años
                var resultado = _sql.getProduccionAnual(acronimo);

                if (resultado == null || resultado.Count == 0)
                {
                    // Retornamos una lista vacía con status 200 para evitar errores en el Frontend
                    return Ok(new List<ProduccionAnual>());
                }

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                // Log del error para depuración en el servidor
                Console.WriteLine($"Error al obtener producción anual para {acronimo}: {ex.Message}");

                return StatusCode(500, "Ocurrió un error interno al procesar el reporte de rendimiento.");
            }
        }

    }
}
