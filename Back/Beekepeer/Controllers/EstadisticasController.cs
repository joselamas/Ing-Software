using Beekepeer.DDBB;
using Beekepeer.Model;
using Beekepeer.Model.ws;
using Microsoft.AspNetCore.Mvc;

namespace Beekepeer.Controllers

{
    [ApiController]
    [Route("api/[controller]")]
    public class EstadisticasController : ControllerBase
    {
        private readonly EstadisticasConsultas _sql;

        public EstadisticasController(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _sql = new EstadisticasConsultas(connectionString);
        }

        [HttpGet]
        [Route("global")]
        public IActionResult GetGlobal([FromQuery] string acronimo)
        {
            if (string.IsNullOrEmpty(acronimo)) return BadRequest("El acrónimo es requerido.");
            
            try {
                var resultado = _sql.CalcularTodo(acronimo);
                return Ok(resultado);
            } catch (Exception ex) {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        [HttpGet]
        [Route("eficiencia")]
        public IActionResult EficienciaApiarios([FromQuery] string acronimo)
        {
            if (string.IsNullOrEmpty(acronimo)) return BadRequest("El acrónimo es requerido.");

            try
            {
                var resultado = _sql.EficienciaApiarios(acronimo);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }
        [HttpGet]
        [Route("produccion")]
        public IActionResult ProduccionApiarios([FromQuery] string acronimo)
        {
            if (string.IsNullOrEmpty(acronimo)) return BadRequest("El acrónimo es requerido.");

            try
            {
                var resultado = _sql.ProduccionApiarios(acronimo);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        [HttpGet]
        [Route("alimentacion")]
        public IActionResult ConsumoAlimentoApiarios([FromQuery] string acronimo)
        {
            if (string.IsNullOrEmpty(acronimo)) return BadRequest("El acrónimo es requerido.");

            try
            {
                var resultado = _sql.ConsumoAlimentoApiarios(acronimo);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        [HttpGet]
        [Route("rendimiento-altura")]
        public IActionResult RendimientoAltura([FromQuery] string acronimo)
        {
            if (string.IsNullOrEmpty(acronimo)) return BadRequest("El acrónimo es requerido.");

            try
            {
                var resultado = _sql.ProduccionPorAltitud(acronimo);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }
    }
}
