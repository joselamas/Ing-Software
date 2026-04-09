using Beekepeer.Model;

namespace Beekepeer.Model
{
    public class Colmena
    {
        public int id { get; set; }
        public int? id_colmena_madre { get; set; }
        public DateTime fecha_inicio { get; set; }
        public string usuario_acronimo { get; set; }
        public bool activo { get; set; }
        public bool es_enjambre { get; set; }
        public string tipo_colmena { get; set; }
        public string estado { get; set; }
        public string id_colmena_usuario { get; set; }
        public DateTime? fecha_inicio_reina { get; set; }

    }



    public class ColmenaRequest : Colmena
    {
        // Hereda todas las propiedades de Colmena y agregamos la que falta
        public int apiario_id { get; set; }
    }

}