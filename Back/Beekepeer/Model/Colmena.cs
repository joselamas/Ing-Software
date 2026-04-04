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



    }
}
