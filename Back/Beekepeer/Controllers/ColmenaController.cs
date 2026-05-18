using Beekepeer.DDBB;
using Beekepeer.Model;
using Beekepeer.DTOs;
using Microsoft.AspNetCore.Mvc;
using Beekepeer.Model.ws;
using System;
using System.Collections.Generic;

namespace Beekepeer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ColmenaController : ControllerBase
    {
        private readonly ColmenaConsultas _sql;
        private readonly ApiarioColmenaConsultas _sqlApiarioColmena;
        private readonly ProduccionMantenimientoConsutas _sqlMantenimiento;

        public ColmenaController(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _sql = new ColmenaConsultas(connectionString);
            _sqlApiarioColmena = new ApiarioColmenaConsultas(connectionString);
            _sqlMantenimiento = new ProduccionMantenimientoConsutas(connectionString);
        }

        // 1. OBTENER TODAS O POR USUARIO
        [HttpGet]
        [Route("getListColmenasUsr")]
        public ActionResult<List<ColmenaWS>> GetLisColmenas([FromQuery] string? usuarioAcronimo)
        {
            if (string.IsNullOrWhiteSpace(usuarioAcronimo))
            {
                return BadRequest("El acrónimo del usuario es obligatorio para listar las colmenas.");
            }

            try
            {
                var resultado = _sql.GetLisColmenas(usuarioAcronimo);

                if (resultado == null || resultado.Count == 0)
                {
                    return Ok(new List<ColmenaWS>());
                }

                // Ya no cargamos alimentación ni producción aquí para agilizar la respuesta
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener las colmenas: {ex.Message}");
                return StatusCode(500, "Ocurrió un error interno al procesar la solicitud.");
            }
        }
        [HttpGet]
        [Route("getDetalleMantenimiento/{idColmena:int}")]
        public ActionResult<HistorialColmenaResponse> GetDetalleMantenimiento(int idColmena)
        {
            if (idColmena <= 0)
            {
                return BadRequest("El ID de la colmena no es válido.");
            }

            try
            {
                // Consultamos de forma independiente usando tu servicio _sqlMantenimiento
                var listaAlimentacion = _sqlMantenimiento.ObtenerAlimentacionPorColmena(idColmena) ?? new List<Alimentacion>();
                var listaProduccion = _sqlMantenimiento.ObtenerProduccionPorColmena(idColmena) ?? new List<Produccion>();

                var respuesta = new HistorialColmenaResponse
                {
                    Alimentacion = listaAlimentacion,
                    Produccion = listaProduccion
                };

                return Ok(respuesta);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener el detalle de mantenimiento para la colmena {idColmena}: {ex.Message}");
                return StatusCode(500, "Ocurrió un error interno al procesar la solicitud.");
            }
        }
        // 2. INSERTAR NUEVA COLMENA
        [HttpPost]
        [Route("insert")]
        public IActionResult Insertar([FromBody] Colmena nueva, [FromQuery] int apiarioId)
        {
            if (nueva == null) return BadRequest("Datos de la colmena no válidos.");
            if (apiarioId <= 0) return BadRequest("Debe especificar un ID de apiario válido.");

            int idGenerado = _sql.InsertarColmena(nueva.usuario_acronimo, nueva.fecha_inicio, nueva.fecha_inicio_reina, nueva.es_enjambre, nueva.id_colmena_madre, nueva.activo, nueva.tipo_colmena, nueva.estado, nueva.id_colmena_usuario);

            if (idGenerado == 0) return StatusCode(500, "Error al registrar la colmena (posible ID duplicado).");

            int relacionExitosa = _sqlApiarioColmena.InsertarColmenaEnApiario(nueva.usuario_acronimo, idGenerado, apiarioId, nueva.fecha_inicio);

            if (relacionExitosa == 0) return StatusCode(500, "Colmena creada, pero falló la asignación al apiario.");

            return Ok(new { mensaje = "Colmena registrada con éxito", id = idGenerado });
        }



        // 3. ACTUALIZAR
        [HttpPut]
        [Route("update")]
        public IActionResult Update([FromBody] ColmenaRequest datos)
        {
            try
            {
                bool exito = _sql.ActualizarColmena(datos.id, datos.usuario_acronimo, datos.fecha_inicio, datos.es_enjambre, datos.id_colmena_madre, datos.activo, datos.apiario_id, datos.tipo_colmena, datos.fecha_inicio_reina, datos.estado, datos.id_colmena_usuario);
                if (exito) return Ok(new { status = 1, mensaje = "¡Colmena actualizada con éxito!", data = datos });
                else return NotFound(new { status = 0, mensaje = "No se encontró la colmena a actualizar." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error SQL al actualizar colmena: {ex.Message}");
                return StatusCode(500, new { status = 0, mensaje = "Error interno del servidor: " + ex.Message });
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
            if (!exito) return NotFound("No se encontró la colmena.");
            return Ok("Colmena eliminada físicamente.");
        }
    }
}