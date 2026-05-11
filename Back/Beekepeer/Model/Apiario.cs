namespace Beekepeer.Model
{
    public class Apiario
    {
        public int id { get; set; }
        public int msnm { get; set; }
        public string acronimo_usuario { get; set; }
        public string nombre_referencia { get; set; }
        public string coordenadas { get; set; }
        public string? tipo_flora { get; set; }
        public int capacidad_maxima { get; set; }
        public string? descripcion_acceso { get; set; }
        public bool activo {  get; set; }
        public DateTime? fecha_creacion { get; set; }

    }
}
