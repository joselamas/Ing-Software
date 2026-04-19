namespace Beekepeer.Model
{
    public class Alimentacion
    {
        public int colmena_id { get; set; }        
        public DateTime fecha {  get; set; }
        public string tipo_suministro { get; set; }
        public string  detalle_mezcla { get; set; }
        public float cantidad { get; set; }
        public float precio_total_insumo { get; set; }
        public string observaciones { get; set; }

    }
}
