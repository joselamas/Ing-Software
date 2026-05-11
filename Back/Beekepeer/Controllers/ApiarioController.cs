using Beekepeer.DDBB;
using Beekepeer.Model;
using Beekepeer.Model.ws;
using Microsoft.AspNetCore.Mvc;

namespace Beekepeer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApiarioController : ControllerBase
    {
        private readonly ApiarioConsultas _sql;
        private readonly ApiarioColmenaConsultas _sqlApiCol;


        public ApiarioController(IConfiguration configuration)
        {
            // Extraemos la conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _sql = new ApiarioConsultas(connectionString);
            _sqlApiCol = new ApiarioColmenaConsultas(connectionString);
        }

        [HttpGet]
        [Route("listarColmenas/{acronimo?}")]
        public dynamic ListarColmenas(string? acronimo = null)
        {
            try
            {
                // 1. Instanciamos el repositorio (o lo usamos vía Inyección de Dependencias)
                // Usamos el método que acabamos de construir
                List<ColmenaApiarioWS> listaColmenas = _sqlApiCol.GetLisColmenasApiario(acronimo);

                // 2. Validamos si hay resultados
                if (listaColmenas == null || listaColmenas.Count == 0)
                {
                    return new
                    {
                        status = 1,
                        mensaje = "No se encontraron colmenas registradas para este usuario.",
                        data = new List<ColmenaApiarioWS>()
                    };
                }

                // 3. Respuesta exitosa con la lista de colmenas empaquetadas
                return new
                {
                    status = 1,
                    mensaje = "Listado de colmenas obtenido con éxito",
                    data = listaColmenas
                };
            }
            catch (Exception ex)
            {
                // 4. Manejo de excepciones para depuración
                return new
                {
                    status = -1,
                    mensaje = "Error interno al obtener el listado: " + ex.Message
                };
            }
        }
        // 1. OBTENER APIARIOS POR USUARIO (Ahora vía GET)
        [HttpGet]
        [Route("listar/{acronimo}")] // El acrónimo viaja como parte de la ruta
        public ActionResult GetApiarios(string acronimo)
        {
            try
            {
                // Validamos que el parámetro no venga vacío
                if (string.IsNullOrWhiteSpace(acronimo))
                {
                    return BadRequest(new { status = 0, mensaje = "El acrónimo del usuario es requerido." });
                }

                // Llamamos directamente al método usando el string
                var lista = _sql.GetApiarios(acronimo);

                // Retornamos directamente la lista (Ok envía status 200)
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = -1, mensaje = "Error interno: " + ex.Message });
            }
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
        [Route("insertar")]
        public IActionResult Insertar([FromBody] Apiario nuevo)
        {
            if (nuevo == null) return BadRequest(new { status = 0, mensaje = "Datos no válidos." });

            int resultado = _sql.InsertarApiario(
                nuevo.acronimo_usuario,
                nuevo.nombre_referencia,
                nuevo.coordenadas,
                nuevo.msnm,
                nuevo.activo,
                nuevo.capacidad_maxima,
                nuevo.tipo_flora,
                nuevo.descripcion_acceso
            );

            if (resultado == -1)
            {
                // 409 Conflict es el código ideal para duplicados
                return Conflict(new { status = 0, mensaje = "Ya existe un apiario registrado en esas coordenadas." });
            }

            if (resultado == 0)
            {
                return StatusCode(500, new { status = 0, mensaje = "Error interno al guardar en BD." });
            }

            return Ok(new { status = 1, mensaje = "Apiario creado con éxito", id = resultado });
        }
      
        
        // 4. ACTUALIZACIÓN DINÁMICA (PATCH)
        // Usamos PATCH porque permite actualizaciones parciales
        [HttpPatch]
        [Route("actualizar")]
        public IActionResult Update([FromBody] Apiario datos)
        {
            bool exito = _sql.ActualizarApiario(
                datos.id,
                datos.acronimo_usuario,
                datos.nombre_referencia,
                datos.coordenadas,
                datos.msnm,
                datos.activo,
                datos.tipo_flora,
                datos.descripcion_acceso,
                datos.capacidad_maxima
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