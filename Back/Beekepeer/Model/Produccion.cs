namespace Beekepeer.Model
{
    public class Produccion
    {
        public int colmena_id { get; set; }
        public DateTime fecha { get; set; }
        public string tipo_origen { get; set; } //monofloral o no
        public string descripcion_flora { get; set; }
        public float cantidad_kg { get; set; }
        public float precio_aprox_kg { get; set; }

    }
}
