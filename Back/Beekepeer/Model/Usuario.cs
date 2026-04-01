namespace Beekepeer.Model
{
    public class Usuario
    {
        public string acronimo { get; set; }
        public string clave { get; set; }
        public string nombre { get; set; }
        public string apellido { get; set; }
        public string correo { get; set; }
        public string telefono { get; set; }
        public string localidad_asociada { get; set; }
        public int permiso { get; set; }
        public bool activo {  get; set; }

    }
}
