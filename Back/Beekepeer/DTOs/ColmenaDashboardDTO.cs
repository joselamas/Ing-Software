using System;
namespace Beekepeer.DTOs
{
    public class ColmenaDashboardDTO
    {
        public int id { get; set; }
        public string usuario_acronimo { get; set; }
        public DateTime fecha_inicio { get; set; }
        public bool es_enjambre { get; set; }
        public int? id_colmena_madre { get; set; }
        public bool activo { get; set; }
        public int apiario_id { get; set; }

    }
}
