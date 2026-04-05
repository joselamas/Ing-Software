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
        [HttpPost]
        [Route("listar")]
        public ActionResult GetApiarios([FromBody] RequestListarApiario request)
        {
            try
            {
                // Validamos que venga el acrónimo
                if (string.IsNullOrEmpty(request.Acronimo))
                {
                    return BadRequest(new { status = 0, mensaje = "El acrónimo del usuario es requerido." });
                }

                var lista = _sql.GetApiarios(request.Acronimo);

                // Retornamos una estructura que el Front pueda validar fácilmente
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = -1, mensaje = "Error interno: " + ex.Message });
            }
        }

        // Clase de apoyo para el mapeo del JSON
        public class RequestListarApiario
        {
            public string Acronimo { get; set; }
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
                nuevo.activo
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